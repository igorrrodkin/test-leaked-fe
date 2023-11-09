import { FC, useMemo } from 'react';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { ISummary } from '@/store/reducers/billing';

interface Props {
  summary: ISummary,
}

enum SummaryColumns {
  MONTH = 'month',
  BALANCE_FROM_PREVIOUS_MONTH = 'balanceFromPreviousMonth',
  COST = 'cost',
  PAYMENT_AND_CREDITS = 'paymentAndCredits',
  CURRENT_BALANCE = 'currentBalance',
}

const SummaryTable: FC<Props> = ({
  summary,
}) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  const getCurrentMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return `${months[currentMonth]} ${currentYear}`;
  };

  const getPrevMonth = () => {
    const prevMonth = new Date().getMonth() - 1;

    if (prevMonth !== 0) {
      return months[prevMonth].toUpperCase();
    }
    return months[11].toUpperCase();
  };

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: SummaryColumns.MONTH,
        content: 'MONTH',
      },
      {
        id: SummaryColumns.BALANCE_FROM_PREVIOUS_MONTH,
        content: `BALANCE FROM ${getPrevMonth()}`,
      },
      {
        id: SummaryColumns.COST,
        content: 'COSTS',
      },
      {
        id: SummaryColumns.PAYMENT_AND_CREDITS,
        content: 'PAYMENT & CREDITS',
      },
      {
        id: SummaryColumns.CURRENT_BALANCE,
        content: 'CURRENT BALANCE',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => [{
    id: summary.currentBalance.toString(),
    isSelectedRow: false,
    columns: [
      {
        id: `currentMonth-${SummaryColumns.MONTH}`,
        content: getCurrentMonth() || '-',
      },
      {
        id: `${summary.balanceFromPreviousMonth}-${SummaryColumns.BALANCE_FROM_PREVIOUS_MONTH}`,
        content: +summary.balanceFromPreviousMonth < 0
          ? `${Number(summary.balanceFromPreviousMonth / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(summary.balanceFromPreviousMonth / 100).toFixed(2)}` || '-',
      },
      {
        id: `${summary.cost}-${SummaryColumns.COST}`,
        content: +summary.cost < 0
          ? `${Number(summary.cost / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(summary.cost / 100).toFixed(2)}` || '-',
      },
      {
        id: `${summary.paymentAndCredits}-${SummaryColumns.PAYMENT_AND_CREDITS}`,
        content: +summary.paymentAndCredits < 0
          ? `${Number(summary.paymentAndCredits / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(summary.paymentAndCredits / 100).toFixed(2)}` || '-',
      },
      {
        id: `${summary.currentBalance}-${SummaryColumns.CURRENT_BALANCE}`,
        content: +summary.currentBalance < 0
          ? `${Number(summary.currentBalance / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(summary.currentBalance / 100).toFixed(2)}` || '-',
      },
    ],
  }], [summary]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default SummaryTable;
