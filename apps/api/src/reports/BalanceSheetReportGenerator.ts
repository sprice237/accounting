import Big from 'big.js';
import { TransactionItemsRepository, UnitOfWork } from '@sprice237/accounting-db';
import { ProfitAndLossReportGenerator } from './ProfitAndLossReportGenerator';

export type BalanceSheetReport = {
  assets: BalanceSheetReportLineItem;
  liabilities: BalanceSheetReportLineItem;
  equity: BalanceSheetReportEquityLineItem;
};

export type BalanceSheetReportLineItem = {
  totalBalance: Big;
  accounts: BalanceSheetReportAccountItem[];
};

export type BalanceSheetReportEquityLineItem = BalanceSheetReportLineItem & {
  netProfit: Big;
  unbalancedTransactionsTotal: Big;
};

export type BalanceSheetReportAccountItem = {
  accountId: string;
  balance: Big;
  descendantsBalance: Big;
};

export class BalanceSheetReportGenerator {
  private uow: UnitOfWork;

  constructor(private readonly portfolioId: string, private readonly reportDate: Date) {
    this.uow = new UnitOfWork();
  }

  async generateReport(): Promise<BalanceSheetReport> {
    const assetAccountItems = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, ['ASSET'], undefined, this.reportDate);
    const liabilityAccountItems = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, ['LIABILITY'], undefined, this.reportDate);
    const equityAccountItems = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAccountBalances(this.portfolioId, ['EQUITY'], undefined, this.reportDate);

    const netProfit = await this.getNetProfit();
    const unbalancedTransactionsTotal = await this.getUnbalancedTransactionsTotal();

    const assetsTotalBalance = assetAccountItems
      .map(({ balance }) => balance)
      .reduce((_sum, balance) => _sum.add(balance), Big(0));

    const liabilitiesTotalBalance = liabilityAccountItems
      .map(({ balance }) => balance)
      .reduce((_sum, balance) => _sum.add(balance), Big(0));

    const equityTotalBalance = [
      ...equityAccountItems.map(({ balance }) => balance),
      netProfit,
      unbalancedTransactionsTotal,
    ].reduce((_sum, balance) => _sum.add(balance), Big(0));

    return {
      assets: {
        totalBalance: assetsTotalBalance,
        accounts: assetAccountItems.map(({ id: accountId, balance, descendantsBalance }) => ({
          accountId,
          balance,
          descendantsBalance,
        })),
      },
      liabilities: {
        totalBalance: liabilitiesTotalBalance,
        accounts: liabilityAccountItems.map(({ id: accountId, balance, descendantsBalance }) => ({
          accountId,
          balance,
          descendantsBalance,
        })),
      },
      equity: {
        totalBalance: equityTotalBalance,
        netProfit,
        unbalancedTransactionsTotal,
        accounts: equityAccountItems.map(({ id: accountId, balance, descendantsBalance }) => ({
          accountId,
          balance,
          descendantsBalance,
        })),
      },
    };
  }

  private async getNetProfit() {
    const profitAndLossReportGenerator = new ProfitAndLossReportGenerator(
      this.portfolioId,
      undefined,
      this.reportDate
    );
    const { netProfit } = await profitAndLossReportGenerator.generateReport();
    return netProfit;
  }

  private async getUnbalancedTransactionsTotal() {
    const { sumDebits, sumCredits } = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAggregationForPortfolioAccounts(this.portfolioId, undefined, this.reportDate);
    return sumCredits.sub(sumDebits).mul(-1);
  }
}
