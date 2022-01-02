import Big from 'big.js';
import { Pojo } from 'objection';
import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';

export type TransactionItemType = 'DEBIT' | 'CREDIT';

export class TransactionItemModel extends BaseModelWithTimestamps {
  static override tableName = 'transactionItems';

  override $parseDatabaseJson(json: Pojo): Pojo {
    return {
      ...super.$parseDatabaseJson(json),
      amount: new Big(json['amount']),
    };
  }

  override $formatDatabaseJson(json: Pojo): Pojo {
    return {
      ...super.$formatDatabaseJson(json),
      amount: json['amount'].toString(),
    };
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
