import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';

export class TransactionModel extends BaseModelWithTimestamps {
  static override tableName = 'transactions';

  id!: string;
  portfolioId!: string;
}

export type Transaction = ModelObjectWithoutTimestamps<TransactionModel>;
