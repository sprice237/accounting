import Big from 'big.js';
import { Model, ModelObject } from 'objection';
import { NumericFilterType } from './numericFilterType';

export class AmountFilterModel extends Model {
  static override tableName = 'amountFilters';

  id!: string;
  transactionItemFilterId!: string;
  type!: NumericFilterType;
  amount!: Big;
}

export type AmountFilter = ModelObject<AmountFilterModel>;
