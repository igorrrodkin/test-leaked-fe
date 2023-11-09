import React, { FC, useMemo, useState } from 'react';

import Input from '@/components/Input';
import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IInvoice } from '@/store/reducers/billing';

import { ChangeEvent } from '@/hooks/useInput';

import convertTimestamp from '@/utils/convertTimestamp';

type Allocation = { invoiceId: number, manualAllocation: number };

interface Props {
  invoices: IInvoice[];
  allocations: Record<number, Allocation>;
  handleChangeAllocation: (id: number, amountVal: number) => void;
}

enum InvoicesColumns {
  INVOICE_NUMBER = 'invoiceNumber',
  DATE = 'date',
  AMOUNT = 'amount',
  PAID = 'paid',
  BALANCE = 'balance',
  ALLOCATE = 'allocate',
  ENDBALANCE = 'endbalance',
}

type TableInputProps = {
  balance: number,
  allocation: Allocation,
  disabled: boolean;
  handleChangeAllocation: (id: number, amountVal: number) => void,
};

const TableInput: FC<TableInputProps> = ({
  balance,
  allocation,
  disabled,
  handleChangeAllocation,
}) => {
  const [state, setState] = useState('');
  const handleChange = (event: ChangeEvent) => {
    const { value } = event.currentTarget;
    if (+value > balance / 100) {
      setState(String(balance / 100));
      handleChangeAllocation(allocation.invoiceId, balance);
    } else if (+value < 0) {
      setState(String(0));
      handleChangeAllocation(allocation.invoiceId, 0);
    } else {
      setState(value);
      handleChangeAllocation(allocation.invoiceId, +value * 100);
    }
  };

  return (
    <Input
      min={0}
      type="number"
      value={state}
      max={balance / 100}
      disabled={disabled}
      inputMarginBottom="0"
      onChange={handleChange}
    />
  );
};

const ManualPaymentTable: React.FC<Props> = ({
  invoices,
  allocations,
  handleChangeAllocation,
}) => {
  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: InvoicesColumns.INVOICE_NUMBER,
        content: 'INVOICE NUMBER',
      },
      {
        id: InvoicesColumns.DATE,
        content: 'DATE',
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
        id: InvoicesColumns.ALLOCATE,
        content: 'ALLOCATE',
      },
      {
        id: InvoicesColumns.ENDBALANCE,
        content: 'END BALANCE',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => invoices.map((el) => ({
    id: el.invoiceNumber,
    isSelectedRow: false,
    columns: [
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.INVOICE_NUMBER}`,
        content: el.invoiceNumber || '-',
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.DATE}`,
        content: convertTimestamp(new Date(el.date).getTime()) || '-',
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
        id: `${el.invoiceNumber}-${InvoicesColumns.ALLOCATE}`,
        content: <TableInput
          balance={el.balance}
          allocation={allocations[el.invoiceId]}
          handleChangeAllocation={handleChangeAllocation}
          disabled={el.status === 'Paid'}
        />,
      },
      {
        id: `${el.invoiceNumber}-${InvoicesColumns.ENDBALANCE}`,
        content: +el.balance < 0
          ? `${Number(el.balance / 100 - allocations[el.invoiceId].manualAllocation / 100 || 0).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.balance / 100 - allocations[el.invoiceId].manualAllocation / 100 || 0).toFixed(2)}` || '-',
      },
    ],
  })), [invoices, allocations]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default ManualPaymentTable;
