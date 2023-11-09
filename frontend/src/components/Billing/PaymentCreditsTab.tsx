import {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PaymentCreditsTable from '@/components/Billing/PaymentCreditsTable';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import ManualAllocateModal from '@/pages/billings/ManualAllocateModal';
import { Content } from '@/pages/Notices';

import { billingActions, getPaymentCreditsAction } from '@/store/actions/billingActions';

import { IPaymentCredits } from '@/store/reducers/billing';

import { selectPaymentCredit } from '@/store/selectors/billingSelectors';
import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

export interface IInvoiceToPay {
  invoiceNumber: string,
  invoiceId: number,
  orgId: number,
}

const limits = [20, 50, 100];

const PaymentCreditsTab: FC = () => {
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [type, setType] = useState(null);
  const [typeRef, isTypeVisible, toggleIsTypeVisible] = useOnClickOutside<HTMLDivElement>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isDataLoading, toggleIsDataLoading] = useToggle(true);
  const [isRefreshLoading, toggleIsRefreshLoading] = useToggle(false);
  const [paymentCredit, setPaymentCredit] = useState<IPaymentCredits | null>(null);
  const [isManualAllocateVisible, toggleIsManualAllocateVisible] = useToggle(false);

  const paymentCredits = useSelector(selectPaymentCredit);
  const user = useSelector(selectUser);

  const dispatch = useDispatch<AppDispatch>();

  const handleOpenManualAllocate = (data: IPaymentCredits) => {
    setPaymentCredit(data);
    toggleIsManualAllocateVisible(true);
  };

  const handleCloseManualAllocate = () => {
    toggleIsManualAllocateVisible(false);
  };

  const handleRefresh = () => {
    toggleIsManualAllocateVisible(false);
    toggleIsRefreshLoading(true);
  };

  useEffect(() => {
    getData();

    return () => {
      dispatch(billingActions.setInvoices(null));
    };
  }, []);

  useEffect(() => {
    if (isRefreshLoading) {
      getData();
    }
  }, [isRefreshLoading]);

  const getData = async () => {
    if (user) {
      try {
        await dispatch(getPaymentCreditsAction(user.organisations[0].id));
        toggleIsDataLoading(false);
        toggleIsRefreshLoading(false);
      } catch (e) {
        toggleIsDataLoading(false);
        toggleIsRefreshLoading(false);
      }
    }
  };

  const setDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const paymentCreditsWithAppliedFilters = useMemo(
    () => paymentCredits?.reduce<IPaymentCredits[]>((prev, curr) => {
      const isExist = curr.allocated.map((i) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(i.invoiceNumber ? i.invoiceNumber.toString().toLowerCase() : '');
      });

      if (isExist.includes(true)) {
        prev.push(curr);
      }

      return prev;
    }, []).filter(() => {
      if (!search) return true;

      return true;
      // const regexp = new RegExp(`.*${search.toLowerCase()}.*`);

      // return (regexp.test(item.reference ? item.reference.toString().toLowerCase() : '')
      // || regexp.test(item.description ? item.description.toString().toLowerCase() : ''));
    }).filter((item) => {
      if (!startDate || !endDate) return true;

      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    }).filter((item) => {
      if (!type) return true;

      return item.type === type;
    })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)) || [],
    [paymentCredits, search, type, startDate, endDate],
  );

  const maxPages = Math.ceil(paymentCreditsWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredPaymentCredits: IPaymentCredits[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (paymentCreditsWithAppliedFilters[i]) {
        filteredPaymentCredits.push(paymentCreditsWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = (startDate && endDate) || type;

  return (
    <>
      {!isDataLoading ? (
        <Content>
          <div style={{ marginBottom: '32px' }}>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Search Reference / Description / Invoice Number',
                clear: () => setSearch(''),
              }}
              datepicker={{
                startDate,
                endDate,
                setDates,
                makeItLast: true,
              }}
              filters={[
                {
                  name: 'Type',
                  value: type,
                  setValue: setType,
                  values: ['EFT', 'Card', 'Refund Credit'],
                  isApplied: !!type,
                  ref: typeRef,
                  containLargeValues: true,
                  isDropdownVisible: isTypeVisible,
                  toggleIsVisible: toggleIsTypeVisible,
                },
              ]}
            />
            {filteredPaymentCredits.length ? (
              <PaymentCreditsTable
                paymentCredits={filteredPaymentCredits}
                onRowClick={handleOpenManualAllocate}
              />
            ) : (
              <NoFound />
            )}
          </div>
          {!!(paymentCredits && paymentCredits.length) && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={
            search || isFiltered
              ? paymentCreditsWithAppliedFilters.length
              : paymentCredits.length
          }
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
          )}
        </Content>
      ) : <Loader />}
      {isManualAllocateVisible && paymentCredit && (
        <ManualAllocateModal
          paymentCredit={paymentCredit}
          onClose={handleCloseManualAllocate}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default PaymentCreditsTab;
