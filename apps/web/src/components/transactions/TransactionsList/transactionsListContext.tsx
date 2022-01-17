import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';
import { TransactionItemFragment, useTransactionItemsQuery } from '@sprice237/accounting-gql';

export type TransactionsListContextSearchParams = {
  startDate?: Date;
  endDate?: Date;
  sourceAccountIds?: string[];
  categoryAccountIds?: string[];
  hasTransaction?: boolean;
  searchText?: string;
};

export type TransactionsListContext = {
  transactionItems: TransactionItemFragment[] | undefined;
  selectedTransactionItems: TransactionItemFragment[];
  setSelectedTransactionItems: Dispatch<SetStateAction<TransactionItemFragment[]>>;
  loadNextPage: (() => void) | null;
  searchParams: TransactionsListContextSearchParams;
  setSearchParams: Dispatch<SetStateAction<TransactionsListContextSearchParams>>;
};

const transactionsListContext = createContext<TransactionsListContext>({
  transactionItems: [],
  selectedTransactionItems: [],
  setSelectedTransactionItems: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  loadNextPage: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  searchParams: {},
  setSearchParams: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useTransactionsListContext = (): TransactionsListContext =>
  useContext<TransactionsListContext>(transactionsListContext);

export const TransactionsListContextProvider: FC = ({ children }) => {
  const [searchParams, setSearchParams] = useState<TransactionsListContextSearchParams>({});
  const [selectedTransactionItems, setSelectedTransactionItems] = useState<
    TransactionItemFragment[]
  >([]);

  const { data, fetchMore } = useTransactionItemsQuery({
    variables: {
      input: {
        pageSize: 10,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        sourceAccountIds: searchParams.sourceAccountIds,
        categoryAccountIds: searchParams.categoryAccountIds,
        hasTransaction: searchParams.hasTransaction,
        searchText: searchParams.searchText,
      },
    },
  });

  const transactionItems = data?.transactionItems.transactionItems;
  const nextPageToken = data?.transactionItems.nextPageToken;

  const loadNextPage = nextPageToken
    ? () => {
        if (!nextPageToken) {
          return;
        }
        fetchMore({
          variables: {
            input: {
              pageSize: 10,
              startDate: searchParams.startDate,
              endDate: searchParams.endDate,
              sourceAccountIds: searchParams.sourceAccountIds,
              categoryAccountIds: searchParams.categoryAccountIds,
              hasTransaction: searchParams.hasTransaction,
              searchText: searchParams.searchText,
              pageToken: nextPageToken,
            },
          },
        });
      }
    : null;

  const contextValue = {
    transactionItems,
    selectedTransactionItems,
    setSelectedTransactionItems,
    loadNextPage,
    searchParams,
    setSearchParams,
  };

  return (
    <transactionsListContext.Provider value={contextValue}>
      {children}
    </transactionsListContext.Provider>
  );
};
