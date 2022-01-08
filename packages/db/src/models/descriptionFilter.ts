import { Model, ModelObject } from 'objection';

export type DescriptionFilterType = 'STARTS_WITH' | 'ENDS_WITH' | 'CONTAINS';

export class DescriptionFilterModel extends Model {
  static override tableName = 'descriptionFilters';

  id!: string;
  transactionItemFilterId!: string;
  type!: DescriptionFilterType;
  text!: string;
}

export type DescriptionFilter = ModelObject<DescriptionFilterModel>;
