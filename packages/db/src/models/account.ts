import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export class AccountModel extends BaseModelWithTimestamps {
  static override tableName = 'accounts';

  id!: string;
  portfolioId!: string;
  type!: AccountType;
  name!: string;
}

export type Account = ModelObjectWithoutTimestamps<AccountModel>;
