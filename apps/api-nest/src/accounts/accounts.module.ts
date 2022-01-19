import { Module } from '@nestjs/common';
import { DatabaseModule } from "../db/database.module";
import { AccountsResolver } from './accounts.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [AccountsResolver],
})
export class AccountsModule {}