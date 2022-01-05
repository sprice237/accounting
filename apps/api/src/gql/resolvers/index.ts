import { Resolvers } from '@sprice237/accounting-gql';
import type { PartialRequired } from '@sprice237/accounting-utils';

import { Context } from '$gql/context';
import { resolvers as Query } from './query';
import { resolvers as Mutation } from './mutation';
import { dateScalarType as Date } from './date';
import { moneyScalarType as Money } from './money';
import { resolvers as Account } from './account';
import { resolvers as BalanceSheetReportAccount } from './balanceSheetReportAccount';
import { resolvers as ProfitAndLossReportAccount } from './profitAndLossReportAccount';
import { resolvers as Transaction } from './transaction';
import { resolvers as TransactionItem } from './transactionItem';
import { resolvers as TransactionItemsReportTransactionItem } from './transactionItemsReportTransactionItem';

export type AppResolvers = PartialRequired<Resolvers<Context>, 'Query' | 'Mutation' | 'Money'>;

export const resolvers: AppResolvers = {
  Query,
  Mutation,
  Account,
  BalanceSheetReportAccount,
  ProfitAndLossReportAccount,
  Date,
  Money,
  Transaction,
  TransactionItem,
  TransactionItemsReportTransactionItem,
};
