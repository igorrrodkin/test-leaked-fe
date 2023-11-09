import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';

import FolderIcon from '@/assets/icons/FolderIcon';

import Status from '@/components/Matters/Status';
import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { userActions } from '@/store/actions/userActions';

import { IMatterAws } from '@/store/reducers/user';

import convertTimestamp from '@/utils/convertTimestamp';
import getNounByForm from '@/utils/getNounByForm';

import { AppDispatch } from '@/store';

enum MattersColumns {
  Organisation = 'organisation',
  Folder = 'folder',
  Matter = 'matter',
  Description = 'description',
  Orders = 'orders',
  Pending = 'pending',
  LastOrdered = 'last_ordered',
}

interface Props {
  matters: IMatterAws[];
}

const MattersTable: React.FC<Props> = ({ matters }) => {
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

  const headers: ITableHeader = useMemo(
    () => ({
      columns: [
        {
          id: MattersColumns.Folder,
          content: <FolderIcon />,
        },
        {
          id: MattersColumns.Organisation,
          content: 'ORGANISATION',
          isForSystemAdmin: true,
        },
        {
          id: MattersColumns.Matter,
          content: 'MATTER',
        },
        {
          id: MattersColumns.Description,
          content: 'DESCRIPTION',
        },
        {
          id: MattersColumns.Orders,
          content: 'ORDERS',
        },
        {
          id: MattersColumns.Pending,
          content: 'PENDING',
        },
        {
          id: MattersColumns.LastOrdered,
          content: 'LAST ORDERED',
        },
      ],
    }),
    [],
  );

  const rows: ITableRow[] = useMemo(
    () => matters.map((matter, i) => ({
      id: matter.matter + i,
      isSelectedRow: false,
      onRowClick: handleRowClick(matter.matter, matter.orgId),
      columns: [
        {
          id: `${MattersColumns.Folder}-${matter.matter}`,
          content: <FolderIcon />,
        },
        {
          id: `${MattersColumns.Organisation}-${matter.matter}`,
          content: matter.orgName,
          isForSystemAdmin: true,
        },
        {
          id: `${MattersColumns.Matter}-${matter.matter}`,
          content: matter.matter,
        },
        {
          id: `${MattersColumns.Description}-${matter.matter}`,
          content: matter.description,
        },
        {
          id: `${MattersColumns.Orders}-${matter.matter}`,
          content: getNounByForm(matter.ordersAmount, 'Order'),
        },
        {
          id: `${MattersColumns.Pending}-${matter.matter}`,
          content: <Status pendingOrders={matter.pendingOrdersAmount} />,
        },
        {
          id: `${MattersColumns.LastOrdered}-${matter.matter}`,
          content: convertTimestamp(matter.lastOrdered),
        },
      ],
    })),
    [matters],
  );

  return <Table header={headers} rows={rows} />;
};

export default MattersTable;
