import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';

export class AccountRelationshipModel extends BaseModelWithTimestamps {
  static override tableName = 'accountRelationships';
  static override idColumn = 'accountId';

  accountId!: string;
  parentAccountId!: string;
}

export type AccountRelationship = ModelObjectWithoutTimestamps<AccountRelationshipModel>;
