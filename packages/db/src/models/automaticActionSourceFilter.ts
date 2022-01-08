import { Model, ModelObject, RelationMappingsThunk } from 'objection';
import { TransactionItemFilter, TransactionItemFilterModel } from './transactionItemFilter';

export class AutomaticActionSourceFilterModel extends Model {
  static override tableName = 'automaticActionSourceFilters';

  static override get relationMappings(): RelationMappingsThunk {
    return () => ({
      transactionItemFilter: {
        relation: Model.BelongsToOneRelation,
        modelClass: TransactionItemFilterModel,
        join: {
          from: `${AutomaticActionSourceFilterModel.tableName}.transactionItemFilterId`,
          to: `${TransactionItemFilterModel.tableName}.id`,
        },
      },
    });
  }

  id!: string;
  automaticActionId!: string;
  transactionItemFilterId!: string;
}

export type AutomaticActionSourceFilter = ModelObject<AutomaticActionSourceFilterModel>;

export type AutomaticActionSourceFilterRelations = {
  transactionItemFilter: TransactionItemFilter;
};
