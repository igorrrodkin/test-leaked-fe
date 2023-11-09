import { FC, useMemo } from 'react';

import { INewInvoiceDetailsRefunds } from '@/store/reducers/billing';

import convertTimestamp from '@/utils/convertTimestamp';

import Table, { ITableHeader, ITableRow } from '../Table/Table';

enum Columns {
  DATE = 'date',
  TYPE = 'type',
  LAST4 = 'last4',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
}

type InvoiceDetailsRefundsTableProps = {
  refunds: INewInvoiceDetailsRefunds[];
};

export const InvoiceDetailsRefundsTable: FC<InvoiceDetailsRefundsTableProps> = ({ refunds }) => {
  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: Columns.DATE,
        content: 'DATE',
      },
      {
        id: Columns.TYPE,
        content: 'TYPE',
      },
      {
        id: Columns.LAST4,
        content: 'LAST4',
      },
      {
        id: Columns.DESCRIPTION,
        content: 'DESCRIPTION',
      },
      {
        id: Columns.AMOUNT,
        content: 'AMOUNT',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => refunds.map((el, index) => ({
    id: `${el.amount}-${index}`,
    isSelectedRow: false,
    columns: [
      {
        id: `${el.date}-${Columns.DATE}`,
        content: el.date ? convertTimestamp(el.date) : '-',
      },
      {
        id: `${el.type}-${Columns.TYPE}`,
        content: el.type || '-',
      },
      {
        id: `${el.last4}-${Columns.LAST4}`,
        content: el.last4 || '-',
      },
      {
        id: `${el.description}-${Columns.DESCRIPTION}`,
        content: el.description || '-',
      },
      {
        id: `${el.amount}-${Columns.AMOUNT}`,
        content: +el.amount < 0
          ? `${Number(el.amount / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.amount / 100).toFixed(2)}` || '-',
      },
    ],
  })), [refunds]);

  return <Table header={tableHeaders} rows={tableRows} />;
};
