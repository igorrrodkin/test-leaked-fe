import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';

import { userActions } from '@/store/actions/userActions';

import { INewInvoiceDetailsMatters } from '@/store/reducers/billing';

import { AppDispatch } from '@/store';

import Table, { ITableHeader, ITableRow } from '../Table/Table';

enum Columns {
  MATTER = 'matter',
  TOTAL_EX = 'totalEx',
  GST = 'gst',
  TOTAL_INC = 'totalInc',
}

type InvoiceDetailsMattersTableProps = {
  matters: INewInvoiceDetailsMatters[];
};

export const InvoiceDetailsMattersTable: FC<InvoiceDetailsMattersTableProps> = ({ matters }) => {
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
        id: Columns.MATTER,
        content: 'MATTER',
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

  const tableRows: ITableRow[] = useMemo(() => matters.map((el) => ({
    id: el.matter,
    isSelectedRow: false,
    columns: [
      {
        id: `${el.matter}-${Columns.MATTER}`,
        content: el.matter || '-',
        onClick: handleRowClick(el.matter, el.orgId),
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
  })), [matters]);

  return <Table header={tableHeaders} rows={tableRows} />;
};
