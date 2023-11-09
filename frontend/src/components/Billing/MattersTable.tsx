import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import base64 from 'base-64';

import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { IInvoiceDetailsMatter } from '@/store/reducers/billing';

interface Props {
  matters: IInvoiceDetailsMatter[],
}

enum MattersColumns {
  MATTER = 'matter',
  EX_GST = 'exGst',
  GST = 'gst',
  INCL_GST = 'inclGst',
}

const MattersTable: React.FC<Props> = ({
  matters,
}) => {
  const navigate = useNavigate();

  const tableHeaders: ITableHeader = useMemo(() => ({
    columns: [
      {
        id: MattersColumns.MATTER,
        content: 'MATTER',
      },
      {
        id: MattersColumns.EX_GST,
        content: 'TOTAL (ex. GST)',
      },
      {
        id: MattersColumns.GST,
        content: 'GST',
      },
      {
        id: MattersColumns.INCL_GST,
        content: 'TOTAL (incl. GST)',
      },
    ],
  }), []);

  const tableRows: ITableRow[] = useMemo(() => matters.map((el) => ({
    id: el.matter + Math.random(),
    isSelectedRow: false,
    onRowClick: () => {
      const query = `${base64.encode(
        `matter=${base64.encode(el.matter)}&organisationId=${el.orgId}`,
      )}`;

      navigate(`/dashboard/matters/orders?${query}`);
    },
    columns: [
      {
        id: `${el.matter}-${MattersColumns.MATTER}`,
        content: el.matter,
      },
      {
        id: `${el.totalEx}-${MattersColumns.EX_GST}`,
        content: `$${Number(el.totalEx / 100).toFixed(2)}`,
      },
      {
        id: `${el.gst}-${MattersColumns.GST}`,
        content: `$${Number(el.gst / 100).toFixed(2)}`,
      },
      {
        id: `${el.totalInc}-${MattersColumns.INCL_GST}`,
        content: `$${Number(el.totalInc / 100).toFixed(2)}`,
      },
    ],
  })), [matters]);

  return <Table header={tableHeaders} rows={tableRows} />;
};

export default MattersTable;
