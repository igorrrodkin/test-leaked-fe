import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import OrdersTable from '@/components/Billing/OrdersTable';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Content } from '@/pages/Notices';

import { IInvoiceDetailsOrder } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import useInput from '@/hooks/useInput';

const limits = [20, 50, 100];

const OrdersTab = () => {
  const [search, setSearch] = useInput();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const { orders } = useSelector(selectInvoiceDetails)!;

  const ordersWithAppliedFilters = useMemo(
    () => orders
      .filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.matter.toLowerCase()) || regexp.test(item.orderId.toLowerCase());
      }) || [],
    [search, orders],
  );

  const maxPages = Math.ceil(ordersWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredOrders: IInvoiceDetailsOrder[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (ordersWithAppliedFilters[i]) {
        filteredOrders.push(ordersWithAppliedFilters[i]);
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
        {filteredOrders.length ? (
          <OrdersTable orders={filteredOrders} />
        ) : (
          <NoFound />
        )}
      </div>
      {!!(orders && orders.length) && (
        <Pagination
          changePage={setOffset}
          currentPage={calculatedOffset}
          maxPages={maxPages}
          maxElements={
            search
              ? ordersWithAppliedFilters.length
              : orders.length
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
