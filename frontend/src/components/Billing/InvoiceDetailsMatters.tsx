import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { InvoiceDetailsMattersTable } from '@/components/Billing/InvoiceDetailsMattersTable';

import { Content } from '@/pages/Notices';

import { INewInvoiceDetailsMatters } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import NoFound from '../NoFound';
import Pagination from '../Pagination';

const limits = [20, 50, 100];

export const InvoiceDetailsMatters: FC = () => {
  const invoiceDetails = useSelector(selectInvoiceDetails);

  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const invoiceMatters = useMemo(
    () => invoiceDetails?.matters || [],
    [],
  );

  const maxPages = Math.ceil(invoiceMatters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredInvoice: INewInvoiceDetailsMatters[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (invoiceMatters[i]) {
        filteredInvoice.push(invoiceMatters[i]);
      }
    }
  }

  return (
    <Content>
      {!filteredInvoice.length ? (
        <NoFound isTextVisible={false} />
      ) : (
        <>
          <InvoiceDetailsMattersTable matters={filteredInvoice} />
          {!!(invoiceDetails && invoiceDetails.matters.length) && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={invoiceMatters.length}
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
