import { Model, ModelObject, RelationMappingsThunk } from 'objection';
import { TransactionItemFilter, TransactionItemFilterModel } from './transactionItemFilter';

export class AutomaticActionExistingTransactionFilterModel extends Model {
  static override tableName = 'automaticActionExistingTransactionFilters';

  static override get relationMappings(): RelationMappingsThunk {
    return () => ({
      transactionItemFilter: {
        relation: Model.BelongsToOneRelation,
        modelClass: TransactionItemFilterModel,
        join: {
          from: `${AutomaticActionExistingTransactionFilterModel.tableName}.transactionItemFilterId`,
          to: `${TransactionItemFilterModel.tableName}.id`,
        },
      },
    });
  }

  id!: string;
  automaticActionId!: string;
  transactionItemFilterId!: string;
}

export type AutomaticActionExistingTransactionFilter =
  ModelObject<AutomaticActionExistingTransactionFilterModel>;

export type AutomaticActionExistingTransactionFilterRelations = {
  transactionItemFilter: TransactionItemFilter;
};
