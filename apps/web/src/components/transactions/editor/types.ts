export type TransactionEditorModel = NewTransaction | ExistingTransaction;

export type NewTransaction = {
  id: null;
} & TransactionContents;

export type ExistingTransaction = {
  id: string;
} & TransactionContents;

export type TransactionContents = {
  items: TransactionItem[];
};

export type TransactionItem = NewTransactionItem | ExistingTransactionItem;

export type NewTransactionItem = {
  id: null;
  newItemIndex: number;
} & TransactionItemContents;

export type ExistingTransactionItem = {
  id: string;
} & TransactionItemContents;

export type TransactionItemContents = {
  accountId: string | undefined;
  date: Date;
  creditAmount: string;
  debitAmount: string;
  description: string;
};
