import Big from 'big.js';
import { RelationMappings, RelationMappingsThunk } from 'objection';
import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';
import { TransactionModel } from './transaction';

export type TransactionItemType = 'DEBIT' | 'CREDIT';

export class TransactionItemModel extends BaseModelWithTimestamps {
  static override tableName = 'transactionItems';

  static override get relationMappings(): RelationMappings | RelationMappingsThunk {
    return () => ({
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
