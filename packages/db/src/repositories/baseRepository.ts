import type { UnitOfWork } from '$/uow';

export class BaseRepository {
  constructor(protected uow: UnitOfWork) {}
}
