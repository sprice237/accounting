import { ModelObject } from 'objection';
import { AccountModel, TransactionItemModel } from '$models';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';
import Big from 'big.js';

export class TransactionItemsRepository extends BaseRepositoryWithDefaultActions<
  TransactionItemModel,
  'id'
> {
  get ModelClass(): typeof TransactionItemModel {
    return TransactionItemModel;
  }

  async getAllForAccount(
    accountId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<
      ModelObject<TransactionItemModel> & {
        runningBalance: Big;
      }
    >
  > {
    let q = this.ModelClass.query(this.uow.queryTarget)
      .where({
        accountId,
      })
      .orderBy('date');

    if (startDate) {
      q = q.where('date', '>=', startDate);
    }

    if (endDate) {
      q = q.where('date', '<', endDate);
    }

    const knexQ = q.toKnexQuery().select({
      runningBalance: this.uow.knexInstance.raw(
        "SUM(amount * (CASE WHEN type = 'DEBIT' THEN -1 ELSE 1 END)) OVER (PARTITION BY account_id ORDER BY date)"
      ),
    });

    const transactionItems = (await knexQ) as Array<
      ModelObject<TransactionItemModel> & {
        runningBalance: Big;
      }
    >;
    return transactionItems;
  }

  async getAggregationForAccount(
    accountId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ sumDebits: Big; sumCredits: Big }> {
    let q = this.ModelClass.query(this.uow.queryTarget).where({
      accountId,
    });

    if (startDate) {
      q = q.where('date', '>=', startDate);
    }

    if (endDate) {
      q = q.where('date', '<', endDate);
    }

    const knexQ = q
      .toKnexQuery()
      .clearSelect()
      .select({
        sumDebits: this.uow.knexInstance.raw(
          "COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0)"
        ),
        sumCredits: this.uow.knexInstance.raw(
          "COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0)"
        ),
      });

    const { sumDebits: sumDebitsStr, sumCredits: sumCreditsStr } = (await knexQ)[0] ?? {
      sumDebits: '0',
      sumCredits: '0',
    };

    const sumDebits = Big(sumDebitsStr);
    const sumCredits = Big(sumCreditsStr);

    return { sumDebits, sumCredits };
  }

  async getAggregationForPortfolioAccounts(
    portfolioId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ sumDebits: Big; sumCredits: Big }> {
    let q = this.uow
      .queryTarget(TransactionItemModel.tableName)
      .whereIn(
        'accountId',
        this.uow.queryTarget(AccountModel.tableName).where({ portfolioId }).select('id')
      )
      .select({
        sumDebits: this.uow.knexInstance.raw(
          "COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0)"
        ),
        sumCredits: this.uow.knexInstance.raw(
          "COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0)"
        ),
      });

    if (startDate) {
      q = q.where('date', '>=', startDate);
    }

    if (endDate) {
      q = q.where('date', '<', endDate);
    }

    const { sumDebits, sumCredits } = (await q)[0] ?? {
      sumDebits: Big(0),
      sumCredits: Big(0),
    };

    return { sumDebits, sumCredits };
  }

  async getAllForTransaction(transactionId: string): Promise<ModelObject<TransactionItemModel>[]> {
    const transactionItemModels = (await this.ModelClass.query(this.uow.queryTarget).where({
      transactionId,
    })) as TransactionItemModel[];
    const transactionItems = transactionItemModels.map(
      (transactionItemModel) => transactionItemModel.toJSON() as ModelObject<TransactionItemModel>
    );
    return transactionItems;
  }
}
