import Big from 'big.js';
import { AccountTypeEnum, TransactionItemTypeEnum } from '@sprice237/accounting-gql';
import {
  AccountsRepository,
  TransactionsRepository,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

import { AppResolvers } from '.';
import { BalanceSheetReportGenerator } from '$/reports/BalanceSheetReportGenerator';
import { ProfitAndLossReportGenerator } from '$/reports/ProfitAndLossReportGenerator';

export const resolvers: AppResolvers['Query'] = {
  async accounts(_1, { input }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const types = input?.types ?? undefined;

    const uow = new UnitOfWork();
    const accounts = await uow.getRepo(AccountsRepository).getAllForPortfolio(portfolio.id, types);
    return accounts.map((account) => ({
      ...account,
      type: account.type as AccountTypeEnum,
    }));
  },
  async transactions(_1, _2, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const uow = new UnitOfWork();
    const transactions = await uow.getRepo(TransactionsRepository).getAllForPortfolio(portfolio.id);
    return transactions.map((transaction) => ({
      ...transaction,
      items: undefined!,
    }));
  },
  async transactionItems(
    _,
    { input: { startDate, endDate, pageSize, pageToken } },
    { assertPortfolio }
  ) {
    const { id: portfolioId } = assertPortfolio();

    const uow = new UnitOfWork();
    const transactionItems = await uow.getRepo(TransactionItemsRepository).getAllForPortfolio(
      portfolioId,
      { pageSize, pageToken: pageToken ?? undefined },
      {
        accountTypes: ['ASSET', 'LIABILITY'],
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
      }
    );

    const lastTransactionItem = transactionItems[transactionItems.length - 1];
    const nextPageToken = lastTransactionItem
      ? `${lastTransactionItem.date.toISOString()}|${lastTransactionItem.id}`
      : undefined;

    return {
      transactionItems: transactionItems.map((transactionItem) => ({
        ...transactionItem,
        account: undefined!,
        transaction: undefined!,
        type: transactionItem.type as TransactionItemTypeEnum,
      })),
      nextPageToken,
    };
  },
  async transactionItemsForAccount(_, { input: { accountId, startDate, endDate } }) {
    const uow = new UnitOfWork();
    const transactionItems = await uow
      .getRepo(TransactionItemsRepository)
      .getAllForAccount(accountId, startDate ?? undefined, endDate ?? undefined);
    return transactionItems.map((transactionItem) => ({
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
      type: transactionItem.type as TransactionItemTypeEnum,
    }));
  },
  async transactionItemsReportForAccount(_, { input: { accountId, startDate, endDate } }) {
    const uow = new UnitOfWork();

    const transactionItems = await uow
      .getRepo(TransactionItemsRepository)
      .getAllForAccount(accountId, startDate ?? undefined, endDate ?? undefined);
    const { sumDebits, sumCredits } = await uow
      .getRepo(TransactionItemsRepository)
      .getAggregationForAccount(accountId, startDate ?? undefined, endDate ?? undefined);

    const { sumDebits: priorSumDebits, sumCredits: priorSumCredits } = startDate
      ? await uow
          .getRepo(TransactionItemsRepository)
          .getAggregationForAccount(accountId, undefined, startDate)
      : { sumDebits: Big(0), sumCredits: Big(0) };

    return {
      items: transactionItems.map((transactionItem) => ({
        ...transactionItem,
        account: undefined!,
        transaction: undefined!,
        type: transactionItem.type as TransactionItemTypeEnum,
      })),
      sumDebits,
      sumCredits,
      priorSumDebits,
      priorSumCredits,
    };
  },
  async balanceSheetReport(_1, { input: { reportDate } }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const reportGenerator = new BalanceSheetReportGenerator(portfolio.id, reportDate);
    const balanceSheetReport = await reportGenerator.generateReport();

    return {
      ...balanceSheetReport,
      assets: {
        ...balanceSheetReport.assets,
        accounts: balanceSheetReport.assets.accounts.map((accountItem) => ({
          ...accountItem,
          account: null!,
        })),
      },
      liabilities: {
        ...balanceSheetReport.liabilities,
        accounts: balanceSheetReport.liabilities.accounts.map((accountItem) => ({
          ...accountItem,
          account: null!,
        })),
      },
      equity: {
        ...balanceSheetReport.equity,
        accounts: balanceSheetReport.equity.accounts.map((accountItem) => ({
          ...accountItem,
          account: null!,
        })),
      },
    };
  },
  async profitAndLossReport(
    _1,
    { input: { reportStartDate, reportEndDate } },
    { assertPortfolio }
  ) {
    const portfolio = assertPortfolio();

    const reportGenerator = new ProfitAndLossReportGenerator(
      portfolio.id,
      reportStartDate,
      reportEndDate
    );
    const profitAndLossReport = await reportGenerator.generateReport();

    return {
      ...profitAndLossReport,
      income: {
        ...profitAndLossReport.income,
        accounts: profitAndLossReport.income.accounts.map((accountItem) => ({
          ...accountItem,
          account: null!,
        })),
      },
      expenses: {
        ...profitAndLossReport.expenses,
        accounts: profitAndLossReport.expenses.accounts.map((accountItem) => ({
          ...accountItem,
          account: null!,
        })),
      },
    };
  },
};
