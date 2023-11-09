import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import MattersTable from '@/components/Billing/MattersTable';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Content } from '@/pages/Notices';

import { IInvoiceDetailsMatter, PaymentType } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import useInput from '@/hooks/useInput';

export const types = (
  Object.values(PaymentType) as Array<PaymentType>
).map((key) => key);

const limits = [20, 50, 100];

const MattersTab = () => {
  const [search, setSearch] = useInput();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const { pricesByMatter } = useSelector(selectInvoiceDetails)!;

  const mattersWithAppliedFilters = useMemo(
    () => pricesByMatter
      .filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.matter.toLowerCase());
      }) || [],
    [search, pricesByMatter],
  );

  const maxPages = Math.ceil(mattersWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredMatters: IInvoiceDetailsMatter[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (mattersWithAppliedFilters[i]) {
        filteredMatters.push(mattersWithAppliedFilters[i]);
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
            placeholder: 'Search matters',
            clear: () => setSearch(''),
          }}
        />
        {filteredMatters.length ? (
          <MattersTable matters={filteredMatters} />
        ) : (
          <NoFound />
        )}
      </div>
      {!!(pricesByMatter && pricesByMatter.length) && (
        <Pagination
          changePage={setOffset}
          currentPage={calculatedOffset}
          maxPages={maxPages}
          maxElements={
            search
              ? mattersWithAppliedFilters.length
              : pricesByMatter.length
          }
          limits={limits}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </Content>
  );
};

export default MattersTab;
