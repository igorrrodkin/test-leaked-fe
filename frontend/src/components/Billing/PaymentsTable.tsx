import React, { useMemo } from 'react';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IPayment } from '@/store/reducers/billing';

import convertTimestamp from '@/utils/convertTimestamp';

interface Props {
  payments: IPayment[],
}

enum PaymentsColumns {
  DATE_RECEIVED = 'dateReceived',
  RECEIPT_NUMBER = 'receiptNumber',
  METHOD = 'method',
  TYPE = 'type',
  AMOUNT = 'amount',
}

const PaymentsTable: React.FC<Props> = ({
  payments,
}) => {
  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: PaymentsColumns.DATE_RECEIVED,
        content: 'DATE RECEIVED',
      },
      {
        id: PaymentsColumns.RECEIPT_NUMBER,
        content: 'RECEIPT NUMBER',
      },
      {
        id: PaymentsColumns.METHOD,
        content: 'METHOD',
      },
      {
        id: PaymentsColumns.TYPE,
        content: 'TYPE',
      },
      {
        id: PaymentsColumns.AMOUNT,
        content: 'AMOUNT',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => payments.map((el) => ({
    id: el.receiptNumber + Math.random(),
    isSelectedRow: false,
    columns: [
      {
        id: `${el.dateReceived}-${PaymentsColumns.DATE_RECEIVED}`,
        content: convertTimestamp(el.dateReceived) || '-',
      },
      {
        id: `${el.receiptNumber}-${PaymentsColumns.RECEIPT_NUMBER}`,
        content: el.receiptNumber || '-',
      },
      {
        id: `${el.method}-${PaymentsColumns.METHOD}`,
        content: el.method ? el.method.charAt(0).toUpperCase() + el.method.slice(1) : '-',
      },
      {
        id: `${el.type}-${PaymentsColumns.TYPE}`,
        content: el.type ? el.type.toUpperCase() : '-',
      },
      {
        id: `${el.amount}-${PaymentsColumns.AMOUNT}`,
        content: el.amount ? `$${Number(el.amount).toFixed(2)}` : '$0.00',
      },
    ],
  })), [payments]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default PaymentsTable;
