import { AutomaticActionDeep, AutomaticActionModel } from '$models';
import { BasePortfolioModelRepositoryWithDefaultActions } from './basePortfolioModelRepositoryWithDefaultActions';

export class AutomaticActionsRepository extends BasePortfolioModelRepositoryWithDefaultActions<
  AutomaticActionModel,
  'id'
> {
  get ModelClass(): typeof AutomaticActionModel {
    return AutomaticActionModel;
  }

  async getAllForPortfolioDeep(portfolioId: string): Promise<AutomaticActionDeep[]> {
    const automaticActionModels = await this.ModelClass.query(this.uow.queryTarget)
      .withGraphFetched('*')
      .where({
        portfolioId,
      })
      .orderBy('orderIndex');
    const modelObjects = automaticActionModels.map(
      (automaticActionModel) => automaticActionModel.toJSON() as unknown as AutomaticActionDeep
    );
    return modelObjects;
  }
}
