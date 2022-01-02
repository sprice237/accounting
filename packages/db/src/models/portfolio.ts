import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';

export class PortfolioModel extends BaseModelWithTimestamps {
  static override tableName = 'portfolios';

  id!: string;
  name!: string;
}

export type Portfolio = ModelObjectWithoutTimestamps<PortfolioModel>;
