import dateAdd from 'date-fns/add';
import dateSub from 'date-fns/sub';

import {
  Account,
  AutomaticActionDeep,
  AutomaticActionsRepository,
  FindTransactionItemsFilter,
  NumericFilterType,
  Portfolio,
  TransactionItem,
  TransactionItemFilter,
  TransactionItemFilterRelations,
  TransactionItemRelations,
  TransactionItemsRepository,
  TransactionsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

export class AutomaticActionsHandler {
  private uow: UnitOfWork;

  private automaticActions: AutomaticActionDeep[] = [];
  private transactionItems: (TransactionItem & TransactionItemRelations)[] = [];

  constructor(private portfolio: Portfolio) {
    this.uow = new UnitOfWork();
  }

  async load(): Promise<void> {
    this.automaticActions = await this.uow
      .getRepo(AutomaticActionsRepository)
      .getAllForPortfolioDeep(this.portfolio.id);

    this.transactionItems = await this.uow
      .getRepo(TransactionItemsRepository)
      .getAllForPortfolioDeep(this.portfolio.id, undefined, { hasTransaction: false }, 'ASC');
  }

  async run(): Promise<void> {
    await this.load();

    for (const transactionItem of this.transactionItems) {
      await this.handleTransactionItem(transactionItem);
    }
  }

  private doesTransactionItemFilterMatch(
    transactionItem: TransactionItem,
    transactionItemFilter: TransactionItemFilter & TransactionItemFilterRelations
  ) {
    const {
      accountFilters,
      amountFilters,
      dateFilters,
      descriptionFilters,
      relativeTimeSpanFilters,
      transactionItemTypeFilters,
    } = transactionItemFilter;

    for (const accountFilter of accountFilters) {
      if (accountFilter.accountId !== transactionItem.accountId) {
        return false;
      }
    }

    for (const amountFilter of amountFilters) {
      switch (amountFilter.type) {
        case NumericFilterType.LT:
          if (!transactionItem.amount.lt(amountFilter.amount)) {
            return false;
          }
          break;
        case NumericFilterType.LTE:
          if (!transactionItem.amount.lte(amountFilter.amount)) {
            return false;
          }
          break;
        case NumericFilterType.GT:
          if (!transactionItem.amount.gt(amountFilter.amount)) {
            return false;
          }
          break;
        case NumericFilterType.GTE:
          if (!transactionItem.amount.gte(amountFilter.amount)) {
            return false;
          }
          break;
        case NumericFilterType.EQ:
          if (!transactionItem.amount.eq(amountFilter.amount)) {
            return false;
          }
          break;
        case NumericFilterType.NEQ:
          if (transactionItem.amount.eq(amountFilter.amount)) {
            return false;
          }
          break;
      }
    }

    for (const dateFilter of dateFilters) {
      console.log('dateFilter', dateFilter);
      throw new Error('not implemented');
    }

    for (const descriptionFilter of descriptionFilters) {
      if (
        descriptionFilter.type == 'STARTS_WITH' &&
        (transactionItem.description ?? '').slice(0, descriptionFilter.text.length) !==
          descriptionFilter.text
      ) {
        return false;
      } else if (
        descriptionFilter.type == 'ENDS_WITH' &&
        (transactionItem.description ?? '').slice(descriptionFilter.text.length * -1) !==
          descriptionFilter.text
      ) {
        return false;
      } else if (
        descriptionFilter.type == 'CONTAINS' &&
        (transactionItem.description ?? '').indexOf(descriptionFilter.text) === -1
      ) {
        return false;
      }
    }

    for (const relativeTimeSpanFilter of relativeTimeSpanFilters) {
      console.log('relativeTimeSpanFilter', relativeTimeSpanFilter);
      throw new Error('not implemented');
    }

    for (const transactionItemTypeFilter of transactionItemTypeFilters) {
      if (transactionItem.type !== transactionItemTypeFilter.type) {
        return false;
      }
    }

    return true;
  }

  private async handleTransactionItem(transactionItem: TransactionItem & TransactionItemRelations) {
    for (const automaticAction of this.automaticActions) {
      const { sourceFilters } = automaticAction;

      if (!sourceFilters.length) {
        console.warn('no source filters defined');
        continue;
      }

      let isMatch = true;
      for (const sourceFilter of sourceFilters) {
        const { transactionItemFilter } = sourceFilter;
        if (!this.doesTransactionItemFilterMatch(transactionItem, transactionItemFilter)) {
          isMatch = false;
        }
      }

      if (!isMatch) {
        continue;
      }

      if (automaticAction.type === 'CREATE_NEW_TRANSACTION') {
        await this.createNewTransaction(transactionItem, automaticAction.newTransactionAccount);
      } else if (automaticAction.type === 'LINK_EXISTING_TRANSACTION_ITEM') {
        await this.linkExistingTransactionItem(
          transactionItem,
          automaticAction.existingTransactionFilters
        );
      }
    }
  }

  private async createNewTransaction(
    transactionItem: TransactionItem & TransactionItemRelations,
    account: Account
  ) {
    await this.uow.executeTransaction(async () => {
      const transaction = await this.uow.getRepo(TransactionsRepository).create({
        portfolioId: this.portfolio.id,
      });
      await this.uow.getRepo(TransactionItemsRepository).update(transactionItem.id, {
        ...transactionItem,
        transactionId: transaction.id,
      });
      await this.uow.getRepo(TransactionItemsRepository).create({
        transactionId: transaction.id,
        accountId: account.id,
        date: transactionItem.date,
        amount: transactionItem.amount.mul(-1),
        description: transactionItem.description,
      });
    });
  }

  private async linkExistingTransactionItem(
    transactionItem: TransactionItem & TransactionItemRelations,
    existingTransactionFilters: AutomaticActionDeep['existingTransactionFilters']
  ) {
    const matchingTransactionItems = await this.findExistingTransactionItems(
      transactionItem,
      existingTransactionFilters
    );

    const [matchedTransactionItem, ...tooManyMatchedTransactionItems] = matchingTransactionItems;

    if (!matchedTransactionItem) {
      return;
    }
    if (tooManyMatchedTransactionItems.length) {
      console.warn('matched too many transaction items');
      return;
    }

    await this.uow.executeTransaction(async () => {
      const transaction = await this.uow.getRepo(TransactionsRepository).create({
        portfolioId: this.portfolio.id,
      });
      await this.uow.getRepo(TransactionItemsRepository).update(transactionItem.id, {
        ...transactionItem,
        transactionId: transaction.id,
      });
      await this.uow.getRepo(TransactionItemsRepository).update(matchedTransactionItem.id, {
        ...matchedTransactionItem,
        transactionId: transaction.id,
      });
    });
  }

  private async findExistingTransactionItems(
    transactionItem: TransactionItem & TransactionItemRelations,
    existingTransactionFilters: AutomaticActionDeep['existingTransactionFilters']
  ) {
    const findTransactionItemsFilters: FindTransactionItemsFilter[] = [
      {
        filterType: 'hasTransaction',
        hasTransaction: false,
      },
      {
        filterType: 'transactionItemType',
        transactionItemType: transactionItem.amount.gte(0) ? 'DEBIT' : 'CREDIT',
      },
      {
        filterType: 'amount',
        op: NumericFilterType.EQ,
        amount: transactionItem.amount,
      },
    ];

    for (const existingTransactionFilter of existingTransactionFilters) {
      const { transactionItemFilter } = existingTransactionFilter;

      const {
        accountFilters,
        amountFilters,
        dateFilters,
        descriptionFilters,
        relativeTimeSpanFilters,
        transactionItemTypeFilters,
      } = transactionItemFilter;

      for (const accountFilter of accountFilters) {
        findTransactionItemsFilters.push({
          filterType: 'account',
          accountId: accountFilter.accountId,
        });
      }

      for (const amountFilter of amountFilters) {
        findTransactionItemsFilters.push({
          filterType: 'amount',
          amount: amountFilter.amount,
          op: amountFilter.type,
        });
      }

      for (const dateFilter of dateFilters) {
        findTransactionItemsFilters.push({
          filterType: 'date',
          date: dateFilter.date,
          op: dateFilter.type,
        });
      }

      for (const descriptionFilter of descriptionFilters) {
        findTransactionItemsFilters.push({
          filterType: 'description',
          description: descriptionFilter.text,
          op: descriptionFilter.type,
        });
      }

      for (const relativeTimeSpanFilter of relativeTimeSpanFilters) {
        findTransactionItemsFilters.push({
          filterType: 'date',
          date: dateSub(transactionItem.date, relativeTimeSpanFilter.span),
          op: NumericFilterType.GTE,
        });

        findTransactionItemsFilters.push({
          filterType: 'date',
          date: dateAdd(transactionItem.date, relativeTimeSpanFilter.span),
          op: NumericFilterType.LTE,
        });
      }

      for (const transactionItemTypeFilter of transactionItemTypeFilters) {
        findTransactionItemsFilters.push({
          filterType: 'transactionItemType',
          transactionItemType: transactionItemTypeFilter.type,
        });
      }
    }

    const matchingTransactionItems = await this.uow
      .getRepo(TransactionItemsRepository)
      .findTransactionItems(this.portfolio.id, findTransactionItemsFilters);

    return matchingTransactionItems;
  }
}
