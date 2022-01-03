import Big from 'big.js';
import {
  AccountsRepository,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

export type ProfitAndLossReport = {
  netProfit: Big;
  income: {
    totalBalance: Big;
    accounts: ProfitAndLossAccountItem[];
  };
  expenses: {
    totalBalance: Big;
    accounts: ProfitAndLossAccountItem[];
  };
};

export type ProfitAndLossAccountItem = {
  accountId: string;
  balance: Big;
};

export class ProfitAndLossReportGenerator {
  private uow: UnitOfWork;

  constructor(
    private readonly portfolioId: string,
    private readonly startDate: Date | undefined,
    private readonly endDate: Date | undefined
  ) {
    this.uow = new UnitOfWork();
  }

  async generateReport(): Promise<ProfitAndLossReport> {
    const incomeAccounts = await this.uow
      .getRepo(AccountsRepository)
      .getAllForPortfolio(this.portfolioId, ['INCOME']);

    const expenseAccounts = await this.uow
      .getRepo(AccountsRepository)
      .getAllForPortfolio(this.portfolioId, ['EXPENSE']);

    const incomeAccountBalances = await Promise.all(
      incomeAccounts.map(async (incomeAccount) =>
        this.generateProfitAndLossAccountItem(incomeAccount)
      )
    );

    const expenseAccountBalances = await Promise.all(
      expenseAccounts.map(async (expenseAccount) =>
        this.generateProfitAndLossAccountItem(expenseAccount)
      )
    );

    const incomeTotalBalance = incomeAccountBalances.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const expensesTotalBalance = expenseAccountBalances.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const netProfit = incomeTotalBalance.add(expensesTotalBalance);

    return {
      netProfit,
      income: {
        totalBalance: incomeTotalBalance,
        accounts: incomeAccountBalances,
      },
      expenses: {
        totalBalance: expensesTotalBalance,
        accounts: expenseAccountBalances,
      },
    };
  }

  private async generateProfitAndLossAccountItem(account: { id: string }) {
    const { sumDebits, sumCredits } = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAggregationForAccount(account.id, this.startDate, this.endDate);
    return {
      accountId: account.id,
      balance: sumCredits.sub(sumDebits),
    };
  }
}
