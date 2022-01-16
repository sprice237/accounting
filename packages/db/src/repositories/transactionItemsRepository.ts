import { ModelObject } from 'objection';
import {
  Account,
  AccountModel,
  AccountRelationshipModel,
  AccountType,
  DescriptionFilterType,
  NumericFilterType,
  NumericFilterTypeOperators,
  TransactionItem,
  TransactionItemModel,
  TransactionItemRelations,
} from '$models';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';
import Big from 'big.js';
import Knex from 'knex';

export type FindTransactionItemsFilter =
  | { filterType: 'account'; accountId: string }
  | { filterType: 'date'; date: Date; op: NumericFilterType }
  | { filterType: 'description'; description: string; op: DescriptionFilterType }
  | { filterType: 'amount'; amount: Big; op: NumericFilterType }
  | { filterType: 'transactionItemType'; transactionItemType: 'DEBIT' | 'CREDIT' }
  | { filterType: 'hasTransaction'; hasTransaction: boolean };

export class TransactionItemsRepository extends BaseRepositoryWithDefaultActions<
  TransactionItemModel,
  'id'
> {
  get ModelClass(): typeof TransactionItemModel {
    return TransactionItemModel;
  }

  async getAllForPortfolio(
    portfolioId: string,
    pagination?: { pageSize: number; pageToken: string | undefined },
    filters?: {
      accountTypes?: AccountType[];
      startDate?: Date;
      endDate?: Date;
      hasTransaction?: boolean;
    },
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<ModelObject<TransactionItemModel>[]> {
    const q = TransactionItemModel.query(this.uow.queryTarget)
      .whereIn(
        'accountId',
        AccountModel.query(this.uow.queryTarget).where({ portfolioId }).select('id')
      )
      .orderBy([{ column: 'date', order: sortOrder }, 'id']);

    if (pagination) {
      q.limit(pagination.pageSize);

      if (pagination.pageToken) {
        const [dateIso, transactionItemId] = pagination.pageToken.split('|') as [string, string];
        q.where(function () {
          this.where('date', '<', dateIso).orWhere(function () {
            this.where('date', '=', dateIso).andWhere('id', '>', transactionItemId);
          });
        });
      }
    }

    if (filters?.accountTypes) {
      q.whereIn(
        'accountId',
        AccountModel.query(this.uow.queryTarget)
          .where({ portfolioId })
          .whereIn('type', filters.accountTypes)
          .select('id')
      );
    }

    if (filters?.startDate) {
      q.where('date', '>=', filters.startDate);
    }

    if (filters?.endDate) {
      q.where('date', '>=', filters.endDate);
    }

    if (filters?.hasTransaction === true) {
      q.whereNotNull('transactionId');
    }

    if (filters?.hasTransaction === false) {
      q.whereNull('transactionId');
    }

    const transactionItemModels = await q;
    const transactionItems = transactionItemModels.map((model) => model.toJSON());
    return transactionItems;
  }

  async getAllForPortfolioDeep(
    portfolioId: string,
    pagination?: { pageSize: number; pageToken: string | undefined },
    filters?: {
      accountTypes?: AccountType[];
      startDate?: Date;
      endDate?: Date;
      hasTransaction?: boolean;
    },
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<(TransactionItem & TransactionItemRelations)[]> {
    const q = TransactionItemModel.query(this.uow.queryTarget)
      .withGraphFetched('[account, transaction]')
      .whereIn(
        'accountId',
        AccountModel.query(this.uow.queryTarget).where({ portfolioId }).select('id')
      )
      .orderBy([{ column: 'date', order: sortOrder }, 'id']);

    if (pagination) {
      q.limit(pagination.pageSize);

      if (pagination.pageToken) {
        const [dateIso, transactionItemId] = pagination.pageToken.split('|') as [string, string];
        q.where(function () {
          this.where('date', '<', dateIso).orWhere(function () {
            this.where('date', '=', dateIso).andWhere('id', '>', transactionItemId);
          });
        });
      }
    }

    if (filters?.accountTypes) {
      q.whereIn(
        'accountId',
        AccountModel.query(this.uow.queryTarget)
          .where({ portfolioId })
          .whereIn('type', filters.accountTypes)
          .select('id')
      );
    }

    if (filters?.startDate) {
      q.where('date', '>=', filters.startDate);
    }

    if (filters?.endDate) {
      q.where('date', '>=', filters.endDate);
    }

    if (filters?.hasTransaction === true) {
      q.whereNotNull('transactionId');
    }

    if (filters?.hasTransaction === false) {
      q.whereNull('transactionId');
    }

    const transactionItemModels = await q;
    const transactionItems = transactionItemModels.map(
      (model) => model.toJSON() as unknown as TransactionItem & TransactionItemRelations
    );
    return transactionItems;
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
        'SUM(amount) OVER (PARTITION BY account_id ORDER BY date)'
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
          'COALESCE(SUM(CASE WHEN amount < 0 THEN (amount * -1) ELSE 0 END), 0)'
        ),
        sumCredits: this.uow.knexInstance.raw(
          'COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0)'
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
          'COALESCE(SUM(CASE WHEN amount < 0 THEN amount * -1 ELSE 0 END), 0)'
        ),
        sumCredits: this.uow.knexInstance.raw(
          'COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0)'
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

  async getAccountBalances(
    portfolioId: string,
    accountTypes?: string[],
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<
      Account & {
        sumDebits: Big;
        sumCredits: Big;
        balance: Big;
        descendantsSumDebits: Big;
        descendantsSumCredits: Big;
        descendantsBalance: Big;
      }
    >
  > {
    const q: Knex.QueryBuilder = this.uow.knexInstance.queryBuilder();

    const cteName = 'accountDescendants';

    q.withRecursive(cteName, (qb: Knex.QueryBuilder) => {
      qb.from(AccountModel.tableName)
        .select({ ancestorAccountId: 'id', accountId: 'id' })
        .union((qb) => {
          qb.from({ parent: cteName })
            .join(
              { ar: AccountRelationshipModel.tableName },
              'parent.accountId',
              'ar.parentAccountId'
            )
            .join({ account: AccountModel.tableName }, 'ar.accountId', 'account.id')
            .select({
              ancestorAccountId: `parent.ancestorAccountId`,
              accountId: `account.id`,
            });
        });
    }).from({ d: cteName });

    q.join({ ancestorAccount: AccountModel.tableName }, 'd.ancestorAccountId', 'ancestorAccount.id')
      .join({ descendantAccount: AccountModel.tableName }, 'd.accountId', 'descendantAccount.id')
      .leftJoin(
        { transactionItem: TransactionItemModel.tableName },
        'transactionItem.accountId',
        'descendantAccount.id'
      )
      .where({
        ['ancestorAccount.portfolioId']: portfolioId,
        ['descendantAccount.portfolioId']: portfolioId,
      })
      .groupBy('ancestorAccount.id')
      .orderBy('ancestorAccount.name')
      .select('ancestorAccount.*', {
        descendantsSumDebits: this.uow.knexInstance.raw(
          'coalesce(sum(case when amount < 0 then amount * -1 else 0 end), 0)'
        ),
        descendantsSumCredits: this.uow.knexInstance.raw(
          'coalesce(sum(case when amount > 0 then amount else 0 end), 0)'
        ),
        descendantsBalance: this.uow.knexInstance.raw('coalesce(sum(amount), 0)'),
      });

    if (accountTypes) {
      q.whereIn('ancestorAccount.type', accountTypes).whereIn(
        'descendantAccount.type',
        accountTypes
      );
    }

    if (startDate) {
      q.where('transactionItem.date', '>=', startDate);
    }

    if (endDate) {
      q.where('transactionItem.date', '<', endDate);
    }

    const outerTransactionItemQ = this.uow.knexInstance.from(TransactionItemModel.tableName);

    if (startDate) {
      outerTransactionItemQ.where('date', '>=', startDate);
    }

    if (endDate) {
      outerTransactionItemQ.where('date', '<', endDate);
    }

    const outerQ = this.uow.knexInstance
      .queryBuilder()
      .from(q.as('q'))
      .leftJoin(
        outerTransactionItemQ.as('outerTransactionItem'),
        'outerTransactionItem.accountId',
        'q.id'
      )
      .groupBy(
        'q.id',
        'q.portfolioId',
        'q.type',
        'q.name',
        'q.createdAt',
        'q.updatedAt',
        'q.descendantsSumDebits',
        'q.descendantsSumCredits',
        'q.descendantsBalance'
      )
      .orderBy('q.name')
      .select('q.*', {
        sumDebits: this.uow.knexInstance.raw(
          'coalesce(sum(case when amount < 0 then amount else 0 end), 0)'
        ),
        sumCredits: this.uow.knexInstance.raw(
          'coalesce(sum(case when amount > 0 then amount else 0 end), 0)'
        ),
        balance: this.uow.knexInstance.raw('coalesce(sum(amount), 0)'),
      });

    const results = (await outerQ) as Array<
      Account & {
        sumDebits: Big;
        sumCredits: Big;
        balance: Big;
        descendantsSumDebits: Big;
        descendantsSumCredits: Big;
        descendantsBalance: Big;
      }
    >;
    return results;
  }

  async findTransactionItems(
    portfolioId: string,
    filters: FindTransactionItemsFilter[] = []
  ): Promise<TransactionItem[]> {
    const q = TransactionItemModel.query(this.uow.queryTarget).whereIn(
      'accountId',
      AccountModel.query(this.uow.queryTarget).where({ portfolioId }).clearSelect().select('id')
    );

    for (const filter of filters) {
      switch (filter.filterType) {
        case 'account':
          q.where({ accountId: filter.accountId });
          break;
        case 'date':
          q.where('date', NumericFilterTypeOperators[filter.op], filter.date);
          break;
        case 'amount':
          q.where('amount', NumericFilterTypeOperators[filter.op], filter.amount.toString());
          break;
        case 'transactionItemType':
          if (filter.transactionItemType === 'DEBIT') {
            q.where('amount', '<', 0);
          } else {
            q.where('amount', '>=', 0);
          }
          break;
        case 'hasTransaction':
          if (filter.hasTransaction) {
            q.whereNotNull('transactionId');
          } else {
            q.whereNull('transactionId');
          }
          break;
      }
    }

    const models = await q;
    const transactionItems = models.map((model) => model.toJSON());
    return transactionItems;
  }
}
