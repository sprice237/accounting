import { FC, createContext, useContext } from 'react';
import { BalanceSheetReportFragment, useBalanceSheetReportQuery } from '@sprice237/accounting-gql';

export type BalanceSheetReportContextValue = {
  report: BalanceSheetReportFragment;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const BalanceSheetReportContext = createContext<BalanceSheetReportContextValue>(null!);
BalanceSheetReportContext.displayName = 'BalanceSheetReportContext';

export const useBalanceSheetReportContext = (): BalanceSheetReportContextValue =>
  useContext(BalanceSheetReportContext);

type BalanceSheetReportContextProviderProps = {
  reportDate: Date;
};

export const BalanceSheetReportContextProvider: FC<BalanceSheetReportContextProviderProps> = ({
  reportDate,
  children,
}) => {
  const { data: { balanceSheetReport: report } = {} } = useBalanceSheetReportQuery({
    variables: {
      input: {
        reportDate,
      },
    },
  });

  if (!report) {
    return null;
  }

  return (
    <BalanceSheetReportContext.Provider value={{ report }}>
      {children}
    </BalanceSheetReportContext.Provider>
  );
};
