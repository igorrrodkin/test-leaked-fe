import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import PaymentsTable from '@/components/Billing/PaymentsTable';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Content } from '@/pages/Notices';

import { IPayment, PaymentType } from '@/store/reducers/billing';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

export const types = (
  Object.values(PaymentType) as Array<PaymentType>
).map((key) => key);

const limits = [20, 50, 100];

const PaymentsTab = () => {
  const [search, setSearch] = useInput();
  const [startDay, setStartDay] = useState<Date | undefined>();
  const [endDay, setEndDay] = useState<Date | undefined>();
  const [type, setType] = useState<PaymentType | null>(null);
  const [typeRef, isTypeVisible, toggleIsTypeVisible] = useOnClickOutside<HTMLDivElement>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const { payments } = useSelector(selectInvoiceDetails)!;

  const submitDates = (start?: Date, end?: Date) => {
    setStartDay(start);
    setEndDay(end);
    setOffset(0);
  };

  const paymentsWithAppliedFilters = useMemo(
    () => payments
      .filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.receiptNumber.toLowerCase());
      })
      .filter((item) => {
        if (!startDay || !endDay) return true;

        const itemDate = new Date(+item.dateReceived);

        return itemDate >= startDay && itemDate <= endDay;
      })
      .filter((item) => {
        if (!type) return true;

        return item.type === type;
      }) || [],
    [search, startDay, endDay, type, payments],
  );

  const maxPages = Math.ceil(paymentsWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredPayments: IPayment[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (paymentsWithAppliedFilters[i]) {
        filteredPayments.push(paymentsWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = !!type;

  return (
    <Content>
      <div>
        <Filters
          search={{
            searchValue: search,
            setSearchValue: setSearch,
            placeholder: 'Search Receipt Number',
            clear: () => setSearch(''),
          }}
          datepicker={{
            startDate: startDay,
            endDate: endDay,
            setDates: submitDates,
            isForMatters: true,
          }}
          filters={[
            {
              name: 'Type',
              value: type,
              setValue: setType,
              values: types,
              isApplied: !!type,
              ref: typeRef,
              isDropdownVisible: isTypeVisible,
              toggleIsVisible: toggleIsTypeVisible,
              containLargeValues: true,
            },
          ]}
        />
        {filteredPayments.length ? (
          <PaymentsTable payments={filteredPayments} />
        ) : (
          <NoFound />
        )}
      </div>
      {!!(payments && payments.length) && (
        <Pagination
          changePage={setOffset}
          currentPage={calculatedOffset}
          maxPages={maxPages}
          maxElements={
            search || isFiltered
              ? paymentsWithAppliedFilters.length
              : payments.length
          }
          limits={limits}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </Content>
  );
};

export default PaymentsTab;
