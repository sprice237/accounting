import { Model, ModelObject } from 'objection';

export class AutomaticActionNewTransactionAccountModel extends Model {
  static override tableName = 'automaticActionNewTransactionAccounts';
  static override idColumn = 'automaticActionId';

  automaticActionId!: string;
  accountId!: string;
}

export type AutomaticActionNewTransactionAccount =
  ModelObject<AutomaticActionNewTransactionAccountModel>;
