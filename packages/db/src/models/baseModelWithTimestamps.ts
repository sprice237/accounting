import { Model } from 'objection';
import type { ModelObject } from 'objection';

export type ModelObjectWithoutTimestamps<T extends BaseModelWithTimestamps> = Omit<
  ModelObject<T>,
  'createdAt' | 'updatedAt'
>;

export abstract class BaseModelWithTimestamps extends Model {
  createdAt!: Date;
  updatedAt!: Date;
}
