import { Model, ModelObject } from 'objection';
import { Interval } from './interval';
import { NumericFilterType } from './numericFilterType';

export class RelativeTimeSpanFilterModel extends Model {
  static override tableName = 'relativeTimeSpanFilters';

  id!: string;
  transactionItemFilterId!: string;
  type!: NumericFilterType;
  span!: Interval;
}

export type RelativeTimeSpanFilter = ModelObject<RelativeTimeSpanFilterModel>;
