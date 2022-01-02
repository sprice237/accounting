import { Model, ModelObject } from 'objection';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';

export abstract class BasePortfolioModelRepositoryWithDefaultActions<
  TModel extends Model & { portfolioId: string },
  TIdField extends keyof ModelObject<TModel>
> extends BaseRepositoryWithDefaultActions<TModel, TIdField> {
  async getAllForPortfolio(portfolioId: string): Promise<ModelObject<TModel>[]> {
    const models = (await this.ModelClass.query(this.uow.queryTarget).where({
      portfolioId,
    })) as TModel[];
    const modelObjects = models.map((model) => model.toJSON() as ModelObject<TModel>);
    return modelObjects;
  }
}
