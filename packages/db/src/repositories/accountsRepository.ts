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
      return await super.getAllForPortfolio(portfolioId);
    }

    const accounts = (await AccountModel.query(this.uow.queryTarget)
      .where('portfolioId', portfolioId)
      .whereIn('type', types)) as AccountModel[];
    const accountObjects = accounts.map((account) => account.toJSON() as ModelObject<AccountModel>);
    return accountObjects;
  }
}
