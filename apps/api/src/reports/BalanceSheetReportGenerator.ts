import Big from 'big.js';
import {
  AccountsRepository,
  AccountType,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';
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
};

export class BalanceSheetReportGenerator {
  private uow: UnitOfWork;

  constructor(private readonly portfolioId: string, private readonly reportDate: Date) {
    this.uow = new UnitOfWork();
  }

  async generateReport(): Promise<BalanceSheetReport> {
    const assetAccountItems = await this.getAssetAccountItems('ASSET');
    const liabilityAccountItems = await this.getAssetAccountItems('LIABILITY');
    const equityAccountItems = await this.getAssetAccountItems('EQUITY');

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
        accounts: assetAccountItems,
      },
      liabilities: {
        totalBalance: liabilitiesTotalBalance,
        accounts: liabilityAccountItems,
      },
      equity: {
        totalBalance: equityTotalBalance,
        netProfit,
        unbalancedTransactionsTotal,
        accounts: equityAccountItems,
      },
    };
  }

  private async getAssetAccountItems(accountType: 'ASSET' | 'LIABILITY' | 'EQUITY') {
    const accounts = await this.uow
      .getRepo(AccountsRepository)
      .getAllForPortfolio(this.portfolioId, [accountType]);

    const accountItems = await Promise.all(
      accounts.map((account) => this.getBalanceSheetReportAccountItem(account))
    );

    return accountItems;
  }

  private async getBalanceSheetReportAccountItem(account: { id: string; type: AccountType }) {
    const { sumDebits, sumCredits } = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAggregationForAccount(account.id, undefined, this.reportDate);
    return {
      accountId: account.id,
      balance: sumCredits.sub(sumDebits),
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
