import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import RefundsTable from '@/components/Billing/RefundsTable';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Content } from '@/pages/Notices';

import { IInvoiceDetailsRefund } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import useInput from '@/hooks/useInput';

const limits = [20, 50, 100];

const OrdersTab = () => {
  const [search, setSearch] = useInput();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const { refunds } = useSelector(selectInvoiceDetails)!;

  const refundsWithAppliedFilters = useMemo(
    () => refunds
      .filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.matter.toLowerCase()) || regexp.test(item.orderId.toLowerCase());
      }) || [],
    [search, refunds],
  );

  const maxPages = Math.ceil(refundsWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredRefunds: IInvoiceDetailsRefund[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (refundsWithAppliedFilters[i]) {
        filteredRefunds.push(refundsWithAppliedFilters[i]);
      }
    }
  }

  return (
    <Content>
      <div>
        <Filters
          search={{
            searchValue: search,
            setSearchValue: setSearch,
            placeholder: 'Matter / Order ID',
            clear: () => setSearch(''),
          }}
        />
        {filteredRefunds.length ? (
          <RefundsTable refunds={filteredRefunds} />
        ) : (
          <NoFound />
        )}
      </div>
      {!!(refunds && refunds.length) && (
        <Pagination
          changePage={setOffset}
          currentPage={calculatedOffset}
          maxPages={maxPages}
          maxElements={
            search
              ? refundsWithAppliedFilters.length
              : refunds.length
          }
          limits={limits}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </Content>
  );
};

export default OrdersTab;
