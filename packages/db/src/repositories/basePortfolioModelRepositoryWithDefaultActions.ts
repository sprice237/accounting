import { Model, ModelObject, QueryBuilderType } from 'objection';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';

export abstract class BasePortfolioModelRepositoryWithDefaultActions<
  TModel extends Model & { portfolioId: string },
  TIdField extends keyof ModelObject<TModel>
> extends BaseRepositoryWithDefaultActions<TModel, TIdField> {
  protected async _getAllForPortfolio(
    portfolioId: string,
    additional?: (qb: QueryBuilderType<TModel>) => void
  ): Promise<ModelObject<TModel>[]> {
    const q = this.ModelClass.query(this.uow.queryTarget).where({
      portfolioId,
    });

    if (additional) {
      additional(q);
    }

    const models = (await q) as TModel[];
    const modelObjects = models.map((model) => model.toJSON() as ModelObject<TModel>);
    return modelObjects;
  }

  async getAllForPortfolio(portfolioId: string): Promise<ModelObject<TModel>[]> {
    return this._getAllForPortfolio(portfolioId);
  }
}
