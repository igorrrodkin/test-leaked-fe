import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';

import { userActions } from '@/store/actions/userActions';

import { INewInvoiceDetailsOrders } from '@/store/reducers/billing';

import convertTimestamp from '@/utils/convertTimestamp';

import { AppDispatch } from '@/store';

import Table, { ITableHeader, ITableRow } from '../Table/Table';

enum Columns {
  DATE_COMPLETED = 'dateCompleted',
  ORDER_DATE = 'orderDate',
  ORDER_ID = 'orderId',
  MATTER = 'matter',
  SERVICE = 'service',
  SEARCH_DETAILS = 'searchDetails',
  TOTAL_EX = 'totalEx',
  GST = 'gst',
  TOTAL_INC = 'totalInc',
}

type InvoiceDetailsOrdersTableProps = {
  orders: INewInvoiceDetailsOrders[];
};

export const InvoiceDetailsOrdersTable: FC<InvoiceDetailsOrdersTableProps> = ({ orders }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleRowClick = (matterId: string, orgId: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { location } = window;
    dispatch(userActions.setVisitedMatterFrom(location.pathname + location.search));

    const query = `${base64.encode(
      `matter=${base64.encode(matterId)}&organisationId=${orgId}`,
    )}`;

    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${
          window.location.origin
        }/dashboard/matters/orders?${query}`,
        '_blank',
      );
      return;
    }

    navigate(
      `/dashboard/matters/orders?${query}`,
    );
  };

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: Columns.DATE_COMPLETED,
        content: 'DATE COMPLETED',
      },
      {
        id: Columns.ORDER_DATE,
        content: 'ORDER DATE',
      },
      {
        id: Columns.ORDER_ID,
        content: 'ORDER ID',
      },
      {
        id: Columns.MATTER,
        content: 'MATTER',
      },
      {
        id: Columns.SERVICE,
        content: 'SERVICE',
      },
      {
        id: Columns.SEARCH_DETAILS,
        content: 'SEARCH DETAILS',
      },
      {
        id: Columns.TOTAL_EX,
        content: 'TOTAL (ex. GST)',
      },
      {
        id: Columns.GST,
        content: 'GST',
      },
      {
        id: Columns.TOTAL_INC,
        content: 'TOTAL (inc. GST)',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => orders.map((el) => ({
    id: `${el.matter}-${el.orderId}`,
    isSelectedRow: false,
    columns: [
      {
        id: `${el.matter}-${Columns.DATE_COMPLETED}`,
        content: convertTimestamp(el.completedAt) || '-',
      },
      {
        id: `${el.matter}-${Columns.ORDER_DATE}`,
        content: convertTimestamp(el.createdAt) || '-',
      },
      {
        id: `${el.matter}-${Columns.ORDER_ID}`,
        content: el.orderId || '-',
      },
      {
        id: `${el.matter}-${Columns.MATTER}`,
        content: el.matter || '-',
        onClick: handleRowClick(el.matter, el.orgId),
      },
      {
        id: `${el.matter}-${Columns.SERVICE}`,
        content: el.service || '-',
      },
      {
        id: `${el.matter}-${Columns.SEARCH_DETAILS}`,
        content: el.searchDetails || '-',
      },
      {
        id: `${el.matter}-${Columns.TOTAL_EX}`,
        content: +el.totalEx < 0
          ? `${Number(el.totalEx / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.totalEx / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.matter}-${Columns.GST}`,
        content: +el.gst < 0
          ? `${Number(el.gst / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.gst / 100).toFixed(2)}` || '-',
      },
      {
        id: `${el.matter}-${Columns.TOTAL_INC}`,
        content: +el.totalInc < 0
          ? `${Number(el.totalInc / 100).toFixed(2).replace('-', '-$')}` || '-'
          : `$${Number(el.totalInc / 100).toFixed(2)}` || '-',
      },
    ],
  })), [orders]);

  return <Table header={tableHeaders} rows={tableRows} />;
};
