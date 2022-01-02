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

  async getAllForAccount(accountId: string): Promise<ModelObject<TransactionItemModel>[]> {
    const transactionItemModels = (await this.ModelClass.query(this.uow.queryTarget).where({
      accountId,
    })) as TransactionItemModel[];
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
