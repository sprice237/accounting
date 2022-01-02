import { Model, Pojo } from 'objection';
import type { ModelObject } from 'objection';

export type ModelObjectWithoutTimestamps<T extends BaseModelWithTimestamps> = Omit<
  ModelObject<T>,
  'createdAt' | 'updatedAt'
>;

export abstract class BaseModelWithTimestamps extends Model {
  override $beforeInsert(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  override $beforeUpdate(): void {
    this.updatedAt = new Date();
  }

  override $parseDatabaseJson(json: Pojo): Pojo {
    return super.$parseDatabaseJson(json);
  }

  override $formatDatabaseJson(json: Pojo): Pojo {
    return super.$formatDatabaseJson(json);
  }

  createdAt!: Date;
  updatedAt!: Date;
}
