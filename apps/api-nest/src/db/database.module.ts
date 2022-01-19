import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService.provider],
  exports: [DatabaseService],
})
export class DatabaseModule {}