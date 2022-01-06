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
      .getAccountBalances(this.portfolioId, false, ['INCOME'], this.startDate, this.endDate);

    const expenseAccounts = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, false, ['EXPENSE'], this.startDate, this.endDate);

    const incomeTotalBalance = incomeAccounts.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const expensesTotalBalance = expenseAccounts.reduce(
      (_sum, { balance }) => _sum.add(balance),
      Big(0)
    );

    const netProfit = incomeTotalBalance.add(expensesTotalBalance);

    const incomeAccountsByHierarchy = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, true, ['INCOME'], this.startDate, this.endDate);

    const expenseAccountsByHierarchy = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, true, ['EXPENSE'], this.startDate, this.endDate);

    return {
      netProfit,
      income: {
        totalBalance: incomeTotalBalance,
        accounts: incomeAccountsByHierarchy.map(
          ({ id: accountId, balance, descendantsBalance }) => ({
            accountId,
            balance,
            descendantsBalance,
          })
        ),
      },
      expenses: {
        totalBalance: expensesTotalBalance,
        accounts: expenseAccountsByHierarchy.map(
          ({ id: accountId, balance, descendantsBalance }) => ({
            accountId,
            balance,
            descendantsBalance,
          })
        ),
      },
    };
  }
}
