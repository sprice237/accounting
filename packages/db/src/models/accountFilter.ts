import { Model, ModelObject } from 'objection';

export class AccountFilterModel extends Model {
  static override tableName = 'accountFilters';

  id!: string;
  transactionItemFilterId!: string;
  accountId!: string;
}

export type AccountFilter = ModelObject<AccountFilterModel>;
