import Big from 'big.js';
import { TransactionItemsRepository, UnitOfWork } from '@sprice237/accounting-db';

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
  descendantsBalance: Big;
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
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, ['INCOME'], this.startDate, this.endDate);
    console.log(incomeAccounts);

    const expenseAccounts = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, ['EXPENSE'], this.startDate, this.endDate);

    const incomeTotalBalance = incomeAccounts.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const expensesTotalBalance = expenseAccounts.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const netProfit = incomeTotalBalance.add(expensesTotalBalance);

    return {
      netProfit,
      income: {
        totalBalance: incomeTotalBalance,
        accounts: incomeAccounts.map(({ id: accountId, balance, descendantsBalance }) => ({
          accountId,
          balance,
          descendantsBalance,
        })),
      },
      expenses: {
        totalBalance: expensesTotalBalance,
        accounts: expenseAccounts.map(({ id: accountId, balance, descendantsBalance }) => ({
          accountId,
          balance,
          descendantsBalance,
        })),
      },
    };
  }
}
