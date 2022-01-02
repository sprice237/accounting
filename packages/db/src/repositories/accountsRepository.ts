import { AccountModel } from '$models';
import { BasePortfolioModelRepositoryWithDefaultActions } from './basePortfolioModelRepositoryWithDefaultActions';

export class AccountsRepository extends BasePortfolioModelRepositoryWithDefaultActions<
  AccountModel,
  'id'
> {
  get ModelClass(): typeof AccountModel {
    return AccountModel;
  }
}
