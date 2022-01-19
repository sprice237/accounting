import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { DatabaseModule } from './db/database.module';
import { GqlModule } from './gql/gql.module';

@Module({
  imports: [
    AccountsModule,
    ConfigModule.forRoot(),
    DatabaseModule, 
    GqlModule, 
  ],
})
export class AppModule {}
