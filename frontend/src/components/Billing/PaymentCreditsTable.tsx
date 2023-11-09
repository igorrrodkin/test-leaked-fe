import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IPaymentCredits } from '@/store/reducers/billing';

import convertTimestamp from '@/utils/convertTimestamp';

interface Props {
  paymentCredits: IPaymentCredits[];
  onRowClick: (data: IPaymentCredits) => void;

}

enum InvoicesColumns {
  DATE = 'date',
  TYPE = 'type',
  REFERENCE = 'reference',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
  ALLOCATED = 'allocated',
  INVOICE_NUMBER = 'invoiceNumber',
  WITHDRAWAL_ID = 'withdrawalId',
}

const PaymentCreditsTable: FC<Props> = ({
  paymentCredits,
  onRowClick,
}) => {
  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: InvoicesColumns.DATE,
        content: 'DATE',
      },
      {
        id: InvoicesColumns.TYPE,
        content: 'TYPE',
      },
      {
        id: InvoicesColumns.REFERENCE,
        content: 'REFERENCE',
      },
      {
        id: InvoicesColumns.DESCRIPTION,
        content: 'DESCRIPTION',
      },
      {
        id: InvoicesColumns.AMOUNT,
        content: 'AMOUNT',
      },
      {
        id: InvoicesColumns.ALLOCATED,
        content: 'ALLOCATED',
      },
      {
        id: InvoicesColumns.INVOICE_NUMBER,
        content: 'INVOICE NUMBER',
      },
      {
        id: InvoicesColumns.WITHDRAWAL_ID,
        content: 'WITHDRAWAL ID',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => paymentCredits.map((el) => ({
    id: `${String(el.orgId)}-${Math.random()}`,
    isSelectedRow: false,
    onRowClick: el.credit > 0 ? () => onRowClick(el) : undefined,
    columns: [
      {
        id: `${el.date}-${InvoicesColumns.DATE}`,
        content: convertTimestamp(new Date(el.date).getTime()) || '-',
      },
      {
        id: `${el.type}-${InvoicesColumns.TYPE}`,
        content: el.type || '-',
      },
      {
        id: `${el.reference}-${InvoicesColumns.REFERENCE}`,
        content: el.reference || '-',
      },
      {
        id: `${el.description}-${InvoicesColumns.DESCRIPTION}`,
        content: el.description || '-',
      },
      {
        id: `${el.amount}-${InvoicesColumns.AMOUNT}`,
        content: +el.amount < 0
          ? `${Number(el.amount / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.amount / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.allocated}-${InvoicesColumns.ALLOCATED}`,
        content: el.allocated.length ? (
          el.allocated.map((item) => (
            <Text>
              {+item.amount < 0
                ? `${Number(item.amount / 100).toFixed(2).replace('-', '-$')}` || '$0.00'
                : `$${Number(item.amount / 100).toFixed(2)}` || '$0.00'}
            </Text>
          ))
        ) : '-',
      },
      {
        id: `${el.amount || '-'}-${Math.random()}-${InvoicesColumns.INVOICE_NUMBER}`,
        content: el.allocated.length ? (
          el.allocated.map((item) => (
            <Text>
              {item.invoiceNumber || '-'}
            </Text>
          ))
        ) : '-',
      },
      {
        id: `${el.amount || '-'}-${Math.random()}-${InvoicesColumns.WITHDRAWAL_ID}`,
        content: el.allocated.length ? (
          el.allocated.map((item) => (
            <Text>
              {item.withdrawalId || '-'}
            </Text>
          ))
        ) : '-',
      },
    ],
  })), [paymentCredits]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default PaymentCreditsTable;

const Text = styled.p`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0px
  }
`;
