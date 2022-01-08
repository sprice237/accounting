import { Model, ModelObject } from 'objection';

export type TransactionItemTypeFilterType = 'CREDIT' | 'DEBIT';

export class TransactionItemTypeFilterModel extends Model {
  static override tableName = 'transactionItemTypeFilters';

  id!: string;
  transactionItemFilterId!: string;
  type!: TransactionItemTypeFilterType;
}

export type TransactionItemTypeFilter = ModelObject<TransactionItemTypeFilterModel>;
