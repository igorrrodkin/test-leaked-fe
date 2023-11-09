import { FC, useMemo } from 'react';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IAllSummary } from '@/store/reducers/billing';

interface Props {
  summary: IAllSummary[],
}

enum SummaryColumns {
  ORGANISATION = 'organization',
  ACCOUNT_LIMIT = 'account_Limit',
  CURRENT_BALANCE = 'currentBalance',
  OPEN_BALANCE = 'open_Balance',
  PAYMENT_THRESHOLD = 'paymentThreshold',
  PAYMENT_TYPE = 'paymentType',
  IN_ARREARS = 'inArrears',
  SUSPENDED = 'suspended',
}

const SummaryTable: FC<Props> = ({
  summary,
}) => {
  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: SummaryColumns.ORGANISATION,
        content: 'ORGANISATION',
      },
      {
        id: SummaryColumns.ACCOUNT_LIMIT,
        content: 'ACCOUNT LIMIT',
      },
      {
        id: SummaryColumns.CURRENT_BALANCE,
        content: 'CURRENT BALANCE',
      },
      {
        id: SummaryColumns.OPEN_BALANCE,
        content: 'OPEN BALANCE',
      },
      {
        id: SummaryColumns.PAYMENT_THRESHOLD,
        content: 'PAYMENT THRESHOLD',
      },
      {
        id: SummaryColumns.PAYMENT_TYPE,
        content: 'PAYMENT TYPE',
      },
      {
        id: SummaryColumns.IN_ARREARS,
        content: 'IN ARREARS',
      },
      {
        id: SummaryColumns.SUSPENDED,
        content: 'SUSPENDED',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => summary.map((el) => ({
    id: el.id.toString(),
    isSelectedRow: false,
    columns: [
      {
        id: `${el.id}-${SummaryColumns.ORGANISATION}`,
        content: el.name || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.ACCOUNT_LIMIT}`,
        content: +el.accountLimit < 0
          ? `${Number(el.accountLimit / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.accountLimit / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.CURRENT_BALANCE}`,
        content: +el.currentBalance < 0
          ? `${Number(el.currentBalance / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.currentBalance / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.OPEN_BALANCE}`,
        content: +el.openBalance < 0
          ? `${Number(el.openBalance / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.openBalance / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.PAYMENT_THRESHOLD}`,
        content: +el.paymentThreshold < 0
          ? `${Number(el.paymentThreshold / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.paymentThreshold / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.PAYMENT_TYPE}`,
        content: el.paymentType || '-',
      },
      {
        id: `${el.id}-${SummaryColumns.IN_ARREARS}`,
        content: String(el.inArrears).toUpperCase(),
      },
      {
        id: `${el.id}-${SummaryColumns.SUSPENDED}`,
        content: String(el.osSuspended).toUpperCase(),
      },
    ],
  })), [summary]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default SummaryTable;
