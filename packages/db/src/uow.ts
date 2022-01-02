import knexConstructor, * as Knex from 'knex';
import { Model } from 'objection';
import { config } from './config';
import type { BaseRepository } from '$repositories/baseRepository';

const knexInstance = knexConstructor(config);
Model.knex(knexInstance);

export class UnitOfWork {
  readonly knexInstance = knexInstance;

  private _transaction: Knex.Transaction | null = null;
  private cachedRepoInstances = new Map<typeof BaseRepository, BaseRepository>();

  get transaction(): Knex.Transaction | null {
    return this._transaction;
  }

  private set transaction(value: Knex.Transaction | null) {
    this._transaction = value;
  }

  get queryTarget(): Knex.Transaction | Knex {
    return this.transaction ?? this.knexInstance;
  }

  getRepo<TRepository extends BaseRepository>(
    repositoryClass: new (...args: ConstructorParameters<typeof BaseRepository>) => TRepository
  ): TRepository {
    if (!this.cachedRepoInstances.has(repositoryClass as typeof BaseRepository)) {
      this.cachedRepoInstances.set(
        repositoryClass as typeof BaseRepository,
        new repositoryClass(this)
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cachedRepoInstances.get(repositoryClass)! as TRepository;
  }

  async beginTransaction(): Promise<void> {
    if (this.transaction) {
      throw new Error('A transaction already exists for this unit of work');
    }

    await new Promise<void>((resolve) => {
      this.knexInstance.transaction((trx) => {
        this.transaction = trx;
        resolve();
      });
    });
  }

  async commitTransaction(): Promise<void> {
    if (!this.transaction) {
      throw new Error('A transaction does not exist for this unit of work');
    }

    await this.transaction.commit();
    this.transaction = null;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.transaction) {
      throw new Error('A transaction does not exist for this unit of work');
    }

    await this.transaction.rollback();
    this.transaction = null;
  }

  async executeTransaction<T = void>(cb: (() => Promise<T>) | (() => T)): Promise<T> {
    await this.beginTransaction();
    try {
      const retVal = await cb();
      await this.commitTransaction();
      return retVal;
    } catch (e) {
      await this.rollbackTransaction();
      throw e;
    }
  }

  static async migrateLatest(config?: knexConstructor.MigratorConfig): Promise<unknown> {
    return await knexInstance.migrate.latest(config);
  }
}
