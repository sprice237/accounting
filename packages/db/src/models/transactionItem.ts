import Big from 'big.js';
import { Pojo, RelationMappings, RelationMappingsThunk } from 'objection';
import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';
import { TransactionModel } from './transaction';

export type TransactionItemType = 'DEBIT' | 'CREDIT';

export class TransactionItemModel extends BaseModelWithTimestamps {
  static override tableName = 'transactionItems';

  override $parseDatabaseJson(json: Pojo): Pojo {
    return {
      ...super.$parseDatabaseJson(json),
      amount: json['amount'] != null ? new Big(json['amount']) : json['amount'],
    };
  }

  override $formatDatabaseJson(json: Pojo): Pojo {
    return {
      ...super.$formatDatabaseJson(json),
      amount: json['amount']?.toString() ?? null,
    };
  }

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
