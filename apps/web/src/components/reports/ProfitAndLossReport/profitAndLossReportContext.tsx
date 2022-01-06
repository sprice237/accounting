import { FC, createContext, useContext } from 'react';
import {
  ProfitAndLossReportFragment,
  useProfitAndLossReportQuery,
} from '@sprice237/accounting-gql';

export type ProfitAndLossReportContextValue = {
  report: ProfitAndLossReportFragment;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ProfitAndLossReportContext = createContext<ProfitAndLossReportContextValue>(null!);
ProfitAndLossReportContext.displayName = 'ProfitAndLossReportContext';

export const useProfitAndLossReportContext = (): ProfitAndLossReportContextValue =>
  useContext(ProfitAndLossReportContext);

type ProfitAndLossReportContextProviderProps = {
  startDate: Date;
  endDate: Date;
};

export const ProfitAndLossReportContextProvider: FC<ProfitAndLossReportContextProviderProps> = ({
  startDate,
  endDate,
  children,
}) => {
  const { data: { profitAndLossReport: report } = {} } = useProfitAndLossReportQuery({
    variables: {
      input: {
        reportStartDate: startDate,
        reportEndDate: endDate,
      },
    },
  });

  if (!report) {
    return null;
  }

  return (
    <ProfitAndLossReportContext.Provider value={{ report }}>
      {children}
    </ProfitAndLossReportContext.Provider>
  );
};
