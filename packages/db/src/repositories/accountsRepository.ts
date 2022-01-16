import { AccountModel, AccountType } from '$models';
import { ModelObject } from 'objection';
import { BasePortfolioModelRepositoryWithDefaultActions } from './basePortfolioModelRepositoryWithDefaultActions';

export class AccountsRepository extends BasePortfolioModelRepositoryWithDefaultActions<
  AccountModel,
  'id'
> {
  get ModelClass(): typeof AccountModel {
    return AccountModel;
  }

  override async getAllForPortfolio(
    portfolioId: string,
    types?: AccountType[]
  ): Promise<ModelObject<AccountModel>[]> {
    if (!types) {
      return await super._getAllForPortfolio(portfolioId, (qb) => qb.orderBy('name'));
    }

    const accounts = await this._getAllForPortfolio(portfolioId, (qb) =>
      qb.whereIn('type', types).orderBy('name')
    );
    return accounts;
  }
}
