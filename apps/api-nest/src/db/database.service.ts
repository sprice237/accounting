import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@sprice237/accounting-db';

@Injectable()
export class DatabaseService {
  static readonly provider = {
    provide: DatabaseService,
    useFactory: async (): Promise<DatabaseService> => {
      UnitOfWork.setConnectionJson(process.env['DB_CONFIG_JSON'] ?? '');
      return new DatabaseService(); 
    }
  }

  createUnitOfWork(): UnitOfWork {
    return new UnitOfWork();
  }
}