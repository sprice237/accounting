import { Model, ModelClass, ModelObject, Id } from 'objection';
import { BaseRepository } from './baseRepository';

export abstract class BaseRepositoryWithDefaultActions<
  TModel extends Model,
  TIdField extends keyof ModelObject<TModel>,
  TInputModelObject = Omit<ModelObject<TModel>, 'createdAt' | 'updatedAt' | TIdField>
> extends BaseRepository {
  abstract get ModelClass(): ModelClass<TModel>;

  async getAll(): Promise<ModelObject<TModel>[]> {
    const models = (await this.ModelClass.query(this.uow.queryTarget)) as TModel[];
    const modelObjects = models.map((model) => model.toJSON());
    return modelObjects;
  }

  async getById(modelId: Id): Promise<ModelObject<TModel> | undefined> {
    const model = (await this.ModelClass.query(this.uow.queryTarget).findById(modelId)) as
      | TModel
      | undefined;
    const modelObject = model?.toJSON() as ModelObject<TModel> | undefined;
    return modelObject;
  }

  async create(input: TInputModelObject): Promise<ModelObject<TModel>> {
    const model = (await this.ModelClass.query(this.uow.queryTarget)
      .insert(input)
      .returning('*')) as TModel;
    const modelObject = model.toJSON() as ModelObject<TModel>;
    return modelObject;
  }

  async update(modelId: Id, input: TInputModelObject): Promise<ModelObject<TModel> | undefined> {
    const model = (await this.ModelClass.query(this.uow.queryTarget).patchAndFetchById(
      modelId,
      input
    )) as TModel | undefined;
    const modelObject = model?.toJSON() as ModelObject<TModel> | undefined;
    return modelObject;
  }

  async delete(modelId: Id): Promise<ModelObject<TModel> | undefined> {
    const model = (await this.ModelClass.query(this.uow.queryTarget)
      .deleteById(modelId)
      .returning('*')
      .first()) as TModel | undefined;
    const modelObject = model?.toJSON() as ModelObject<TModel> | undefined;
    return modelObject;
  }
}
