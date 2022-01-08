import { Model, ModelObject } from 'objection';
import { NumericFilterType } from './numericFilterType';

export class DateFilterModel extends Model {
  static override tableName = 'dateFilters';

  id!: string;
  type!: NumericFilterType;
  date!: Date;
}

export type DateFilter = ModelObject<DateFilterModel>;
