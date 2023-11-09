import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';
import moment from 'moment';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IInvoiceDetailsOrder } from '@/store/reducers/billing';

import { getQueries } from '@/utils/api';

interface Props {
  orders: IInvoiceDetailsOrder[],
}

enum OrdersColumns {
  DATE_COMPLETED = 'dateCompleted',
  ORDER_DATE = 'orderDate',
  ORDER_ID = 'orderId',
  MATTER = 'matter',
  SERVICE = 'service',
  SEARCH_DETAILS = 'searchDetails',
  EX_GST = 'exGst',
  GST = 'gst',
  INCL_GST = 'inclGst',
}

const OrdersTable: React.FC<Props> = ({
  orders,
}) => {
  const navigate = useNavigate();

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: OrdersColumns.DATE_COMPLETED,
        content: 'DATE COMPLETED',
      },
      {
        id: OrdersColumns.ORDER_DATE,
        content: 'ORDER DATE',
      },
      {
        id: OrdersColumns.ORDER_ID,
        content: 'ORDER ID',
      },
      {
        id: OrdersColumns.MATTER,
        content: 'MATTER',
      },
      {
        id: OrdersColumns.SERVICE,
        content: 'SERVICE',
      },
      {
        id: OrdersColumns.SEARCH_DETAILS,
        content: 'SEARCH DETAILS',
      },
      {
        id: OrdersColumns.EX_GST,
        content: 'TOTAL (ex. GST)',
      },
      {
        id: OrdersColumns.GST,
        content: 'GST',
      },
      {
        id: OrdersColumns.INCL_GST,
        content: 'TOTAL (incl. GST)',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => orders.map((el) => ({
    id: el.orderId,
    isSelectedRow: false,
    onRowClick: () => {
      const query = Base64.encode(getQueries({
        orderId: el.orderId,
        linkId: 0,
      }));

      navigate(`/dashboard/orders/${el.orgId}/${el.matter}?${query}`);
    },
    columns: [
      {
        id: `${el.dateCompleted}-${OrdersColumns.DATE_COMPLETED}`,
        content: moment(+el.dateCompleted).format('hh:mm A MM/DD/YYYY'),
      },
      {
        id: `${el.orderDate}-${OrdersColumns.ORDER_DATE}`,
        content: moment(+el.orderDate).format('hh:mm A MM/DD/YYYY'),
      },
      {
        id: `${el.orderId}-${OrdersColumns.ORDER_ID}`,
        content: el.orderId,
      },
      {
        id: `${el.matter}-${OrdersColumns.MATTER}`,
        content: el.matter,
      },
      {
        id: `${el.service}-${OrdersColumns.SERVICE}`,
        content: el.service,
      },
      {
        id: `${el.searchDetails}-${OrdersColumns.SEARCH_DETAILS}`,
        content: el.searchDetails,
      },
      {
        id: `${el.totalEx}-${OrdersColumns.EX_GST}`,
        content: `$${(+el.totalEx / 100).toFixed(2)}`,
      },
      {
        id: `${el.gst}-${OrdersColumns.GST}`,
        content: `$${(+el.gst / 100).toFixed(2)}`,
      },
      {
        id: `${el.totalInc}-${OrdersColumns.INCL_GST}`,
        content: `$${(+el.totalInc / 100).toFixed(2)}`,
      },
    ],
  })), [orders]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default OrdersTable;
