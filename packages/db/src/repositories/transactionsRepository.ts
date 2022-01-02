import { TransactionModel } from '$models';
import { BasePortfolioModelRepositoryWithDefaultActions } from './basePortfolioModelRepositoryWithDefaultActions';

export class TransactionsRepository extends BasePortfolioModelRepositoryWithDefaultActions<
  TransactionModel,
  'id'
> {
  get ModelClass(): typeof TransactionModel {
    return TransactionModel;
  }
}
