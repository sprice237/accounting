import Big from 'big.js';
import { RelationMappings, RelationMappingsThunk } from 'objection';
import { Account, AccountModel } from './account';
import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';
import { Transaction, TransactionModel } from './transaction';

export type TransactionItemType = 'DEBIT' | 'CREDIT';

export class TransactionItemModel extends BaseModelWithTimestamps {
  static override tableName = 'transactionItems';

  static override get relationMappings(): RelationMappings | RelationMappingsThunk {
    return () => ({
      account: {
        relation: BaseModelWithTimestamps.BelongsToOneRelation,
        modelClass: AccountModel,
        join: {
          from: 'transactionItems.accountId',
          to: 'accounts.id',
        },
      },
      transaction: {
        relation: BaseModelWithTimestamps.BelongsToOneRelation,
        modelClass: TransactionModel,
        join: {
          from: 'transactionItems.transactionId',
          to: 'transactions.id',
        },
      },
    });
  }

  id!: string;
  transactionId!: string | null;
  accountId!: string;
  date!: Date;
  type!: TransactionItemType;
  amount!: Big;
  description!: string | null;
}

export type TransactionItem = ModelObjectWithoutTimestamps<TransactionItemModel>;

export type TransactionItemRelations = {
  account: Account;
  transaction: Transaction;
};
