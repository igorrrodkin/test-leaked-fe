import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { InvoiceDetailsOrdersTable } from '@/components/Billing/InvoiceDetailsOrdersTable';

import { Content } from '@/pages/Notices';

import { INewInvoiceDetailsOrders } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import NoFound from '../NoFound';
import Pagination from '../Pagination';

const limits = [20, 50, 100];

export const InvoiceDetailsOrders: FC = () => {
  const invoiceDetails = useSelector(selectInvoiceDetails);

  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const invoiceOrders = useMemo(
    () => invoiceDetails?.orders || [],
    [],
  );

  const maxPages = Math.ceil(invoiceOrders.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredInvoice: INewInvoiceDetailsOrders[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (invoiceOrders[i]) {
        filteredInvoice.push(invoiceOrders[i]);
      }
    }
  }

  return (
    <Content>
      {!filteredInvoice.length ? (
        <NoFound isTextVisible={false} />
      ) : (
        <>
          <InvoiceDetailsOrdersTable orders={filteredInvoice} />
          {!!(invoiceDetails && invoiceDetails.matters.length) && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={invoiceOrders.length}
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
          )}
        </>
      )}
    </Content>
  );
};
