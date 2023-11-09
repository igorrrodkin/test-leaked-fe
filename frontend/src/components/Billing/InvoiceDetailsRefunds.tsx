import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { InvoiceDetailsRefundsTable } from '@/components/Billing/InvoiceDetailsRefundsTable';

import { Content } from '@/pages/Notices';

import { INewInvoiceDetailsRefunds } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import NoFound from '../NoFound';
import Pagination from '../Pagination';

const limits = [20, 50, 100];

export const InvoiceDetailsRefunds: FC = () => {
  const invoiceDetails = useSelector(selectInvoiceDetails);

  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const invoiceRefunds = useMemo(
    () => invoiceDetails?.refunds || [],
    [],
  );

  const maxPages = Math.ceil(invoiceRefunds.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredInvoice: INewInvoiceDetailsRefunds[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (invoiceRefunds[i]) {
        filteredInvoice.push(invoiceRefunds[i]);
      }
    }
  }

  return (
    <Content>
      {!filteredInvoice.length ? (
        <NoFound isTextVisible={false} />
      ) : (
        <>
          <InvoiceDetailsRefundsTable refunds={filteredInvoice} />
          {!!(invoiceDetails && invoiceDetails.matters.length) && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={invoiceRefunds.length}
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
