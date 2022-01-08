export enum NumericFilterType {
  LT = 'lt',
  LTE = 'lte',
  GT = 'gt',
  GTE = 'gte',
  EQ = 'eq',
  NEQ = 'neq',
}

export const NumericFilterTypeOperators: Record<NumericFilterType, string> = {
  [NumericFilterType.LT]: '<',
  [NumericFilterType.LTE]: '<=',
  [NumericFilterType.GT]: '>',
  [NumericFilterType.GTE]: '>=',
  [NumericFilterType.EQ]: '=',
  [NumericFilterType.NEQ]: '<>',
};
