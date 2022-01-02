import { ModelObject } from 'objection';
import { TransactionItemModel } from '$models';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';

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
  ): Promise<ModelObject<TransactionItemModel>[]> {
    let q = this.ModelClass.query(this.uow.queryTarget).where({
      accountId,
    });

    if (startDate) {
      q = q.where('date', '>=', startDate);
    }

    if (endDate) {
      q = q.where('date', '<', endDate);
    }

    const transactionItemModels = (await q) as TransactionItemModel[];
    const transactionItems = transactionItemModels.map(
      (transactionItemModel) => transactionItemModel.toJSON() as ModelObject<TransactionItemModel>
    );
    return transactionItems;
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
