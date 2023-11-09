import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IInvoiceToPay } from '@/components/Billing/InvoicesTab';
import Button from '@/components/Button';
import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IInvoice, InvoiceStatuses } from '@/store/reducers/billing';

import convertTimestamp from '@/utils/convertTimestamp';

interface Props {
  invoices: IInvoice[],
  setInvoiceToPay?: React.Dispatch<React.SetStateAction<IInvoiceToPay | undefined>>,
}

enum InvoicesColumns {
  ORGANISATION = 'organization',
  DATE = 'date',
  DUE_DATE = 'dueDate',
  PAYMENT_TERMS = 'paymentTerms',
  DAYS_OVERDUE = 'daysOverdue',
  AMOUNT = 'amount',
  PAID = 'paid',
  BALANCE = 'balance',
  INVOICE_NUMBER = 'invoiceNumber',
  INVOICE_ACTION = 'invoiceAction',
  STATUS = 'status',
}

const InvoicesTable: React.FC<Props> = ({
  invoices,
  setInvoiceToPay,
}) => {
  const navigate = useNavigate();

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: InvoicesColumns.ORGANISATION,
        content: 'ORGANISATION',
      },
      {
        id: InvoicesColumns.DATE,
        content: 'DATE',
      },
      {
        id: InvoicesColumns.DUE_DATE,
        content: 'DUE DATE',
      },
      {
        id: InvoicesColumns.PAYMENT_TERMS,
        content: 'PAYMENT TERMS',
      },
      {
        id: InvoicesColumns.DAYS_OVERDUE,
        content: 'DAYS OVERDUE',
      },
      {
        id: InvoicesColumns.AMOUNT,
        content: 'AMOUNT',
      },
      {
        id: InvoicesColumns.PAID,
        content: 'PAID',
      },
      {
        id: InvoicesColumns.BALANCE,
        content: 'BALANCE',
      },
      {
        id: InvoicesColumns.INVOICE_NUMBER,
        content: 'INVOICE NUMBER',
      },
      {
        id: InvoicesColumns.STATUS,
        content: 'STATUS',
      },
      ...(setInvoiceToPay ? [{
        id: InvoicesColumns.INVOICE_ACTION,
        content: '',
      }] : []),
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => invoices.map((el) => ({
    id: el.invoiceNumber,
    isSelectedRow: false,
    onRowClick: () => {
      navigate(`/billings/invoiceDetails/${el.invoiceNumber}`);
    },
    columns: [
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.ORGANISATION}`,
        content: el.orgName || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.DATE}`,
        content: convertTimestamp(new Date(el.date).getTime()) || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.DUE_DATE}`,
        content: convertTimestamp(new Date(el.dueDate).getTime()) || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.PAYMENT_TERMS}`,
        content: el.paymentTerms.replace('_', ' ') || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.DAYS_OVERDUE}`,
        content: String(el.daysOverdue) || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.AMOUNT}`,
        content: +el.amount < 0
          ? `${Number(el.amount / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.amount / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.PAID}`,
        content: +el.paid < 0
          ? `${Number(el.paid / 100).toFixed(2).replace('-', '-$')}` || '$0.00'
          : `$${Number(el.paid / 100).toFixed(2)}` || '$0.00',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.BALANCE}`,
        content: +el.balance < 0
          ? `${Number(el.balance / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.balance / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.INVOICE_NUMBER}`,
        content: el.invoiceNumber || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.STATUS}`,
        content: el.status || '-',
      },
      ...(setInvoiceToPay && (el.status === InvoiceStatuses.OPEN || el.status === InvoiceStatuses.OVERDUE) ? [{
        id: `${el.invoiceNumber}-${InvoicesColumns.INVOICE_ACTION}`,
        content: (
          <Button
            width="100px"
            onClick={(evt) => {
              evt.stopPropagation();

              setInvoiceToPay!({
                invoiceNumber: el.invoiceNumber,
                invoiceId: el.organisationId,
                orgId: el.organisationId,
              });
            }}
          >
            Pay Now
          </Button>
        ),
      }] : [{
        id: `${el.invoiceNumber}-${InvoicesColumns.INVOICE_ACTION}`,
        content: '',
      }]),
    ],
  })), [invoices]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default InvoicesTable;
