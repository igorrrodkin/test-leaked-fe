import {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import ManualAllocateModal from '@/pages/billings/ManualAllocateModal';
import ManualPaymentModal from '@/pages/billings/ManualPaymentModal';
import PaymentCreditsTable from '@/pages/billings/PaymentCreditsTable';
import WithdrawModal from '@/pages/billings/WithdrawModal';

import { billingActions, getPaymentCreditsAction } from '@/store/actions/billingActions';

import { IPaymentCredits } from '@/store/reducers/billing';
import { IOrganisation } from '@/store/reducers/organisations';

import { selectPaymentCredit } from '@/store/selectors/billingSelectors';
import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';

import { AppDispatch } from '@/store';

export interface IInvoiceToPay {
  invoiceNumber: string,
  invoiceId: number,
  orgId: number,
}

const limits = [20, 50, 100];

const PaymentCredits: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [limit, setLimit] = useState(0);
  const [search, setSearch] = useInput();
  const [type, setType] = useState(null);
  const [offset, setOffset] = useState(0);
  const [endDate, setEndDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [orgItem, setOrgItem] = useState<IOrganisation | null>(null);

  const [isDataLoading, toggleIsDataLoading] = useToggle(true);
  const [isRefreshLoading, toggleIsRefreshLoading] = useToggle(false);
  const [isWithdrawVisible, toggleIsWithdraVisible] = useToggle(false);
  const [isManualPaymentVisible, toggleIsManualPaymentVisible] = useToggle(false);
  const [paymentCredit, setPaymentCredit] = useState<IPaymentCredits | null>(null);
  const [isManualAllocateVisible, toggleIsManualAllocateVisible] = useToggle(false);

  const [typeRef, isTypeVisible, toggleIsTypeVisible] = useOnClickOutside<HTMLDivElement>();
  const [orgRef, isOrgsVisible, toggleIsOrgsVisible] = useOnClickOutside<HTMLDivElement>();

  const user = useSelector(selectUser);
  const organisations = useSelector(selectBaseOrganisationsInfo);
  const paymentCredits = useSelector(selectPaymentCredit);

  const organisationsNames = useMemo(() => {
    if (organisations) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name}${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [organisations]);

  const setDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleOpenWithdraw = () => {
    toggleIsWithdraVisible(true);
  };

  const handleCloseWithdraw = () => {
    toggleIsWithdraVisible(false);
  };

  const handleOpenManualPayment = () => {
    toggleIsManualPaymentVisible(true);
  };

  const handleCloseManualPayment = () => {
    toggleIsManualPaymentVisible(false);
  };

  const handleOpenManualAllocate = (data: IPaymentCredits) => {
    setPaymentCredit(data);
    toggleIsManualAllocateVisible(true);
  };

  const handleCloseManualAllocate = () => {
    toggleIsManualAllocateVisible(false);
  };

  const handleRefresh = () => {
    toggleIsWithdraVisible(false);
    toggleIsManualPaymentVisible(false);
    toggleIsManualAllocateVisible(false);
    toggleIsRefreshLoading(true);
  };

  useEffect(() => {
    getData();

    return () => {
      dispatch(billingActions.setPaymentCredits(null));
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
        toggleIsDataLoading(true);
        await dispatch(getPaymentCreditsAction());
        toggleIsDataLoading(false);
        toggleIsRefreshLoading(false);
      } catch (e) {
        toggleIsDataLoading(false);
        toggleIsRefreshLoading(false);
      }
    }
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
      if (!orgItem) return true;

      return item.orgId === orgItem.id;
    }).filter((item) => {
      if (!startDate || !endDate) return true;

      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    })
      .filter((item) => {
        if (!type) return true;

        return item.type === type;
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)) || [],
    [paymentCredits, search, orgItem, type, startDate, endDate],
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

  const isFiltered = (startDate && endDate) || !!type || !!orgItem;

  return (
    <>
      {!isDataLoading ? (
        <Content>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
            <Button type="button" onClick={handleOpenWithdraw}>Withdraw</Button>
            <Button type="button" onClick={handleOpenManualPayment}>Manual Payment</Button>
          </div>
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
                {
                  name: 'Organisation',
                  value: orgItem?.name || '',
                  setValue: setOrgItem,
                  values: organisationsNames,
                  keyForValue: 'name',
                  isApplied: !!orgItem,
                  ref: orgRef,
                  isDropdownVisible: isOrgsVisible,
                  toggleIsVisible: toggleIsOrgsVisible,
                  containLargeValues: true,
                  isUseSearch: true,
                  isSortValeus: true,
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
      {isWithdrawVisible && (
      <WithdrawModal
        onClose={handleCloseWithdraw}
        handleRefresh={handleRefresh}
      />
      )}
      {isManualPaymentVisible && (
      <ManualPaymentModal
        onClose={handleCloseManualPayment}
        handleRefresh={handleRefresh}
      />
      )}
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

export default PaymentCredits;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  padding: 0 32px;
`;
