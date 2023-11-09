import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import InvoicesTable from '@/components/Billing/InvoicesTable';
import Loader from '@/components/Loader';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { Content } from '@/pages/Notices';

import { billingActions, getInvoicesAction, payNowAction } from '@/store/actions/billingActions';
import { userActions } from '@/store/actions/userActions';

import { IInvoice, InvoiceStatuses } from '@/store/reducers/billing';
import { PopupTypes } from '@/store/reducers/user';

import { selectInvoices } from '@/store/selectors/billingSelectors';
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

const InvoicesTab = () => {
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState(null);
  const [statusRef, isStatusVisible, toggleIsStatusVisible] = useOnClickOutside<HTMLDivElement>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const [invoiceToPay, setInvoiceToPay] = useState<IInvoiceToPay>();
  const [isDataLoading, toggleIsDataLoading] = useToggle(true);

  const invoices = useSelector(selectInvoices);
  const user = useSelector(selectUser);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getData();

    return () => {
      dispatch(billingActions.setInvoices(null));
    };
  }, []);

  const getData = async () => {
    if (user) {
      try {
        await dispatch(getInvoicesAction(user.organisations[0].id));

        toggleIsDataLoading(false);
      } catch (e) {
        toggleIsDataLoading(false);
      }
    }
  };

  const setDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const payNow = async (orgId: number, invoiceId: number, invoiceNumber: string) => {
    try {
      toggleIsDataLoading(true);

      await dispatch(payNowAction(orgId, invoiceNumber));

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success',
        additionalText: `Invoice ${invoiceNumber} have been paid`,
      }));

      setInvoiceToPay(undefined);
      toggleIsDataLoading(false);
    } catch (e) {
      toggleIsDataLoading(false);
    }
  };

  const invoicesWithAppliedFilters = useMemo(
    () => invoices
      ?.filter((item) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(item.invoiceNumber.toLowerCase());
      }).filter((item) => {
        if (!startDate || !endDate) return true;

        const date = new Date(item.date);
        return date >= startDate && date <= endDate;
      }).filter((item) => {
        if (!status) return true;

        return item.status === status;
      }).sort((a, b) => {
        if (a.date === b.date) {
          return +(a.date || 0) < +(b.date || 0) ? -1 : 1;
        }
        return +b.date < +a.date ? -1 : 1;
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)) || [],
    [search, invoices, status, startDate, endDate],
  );

  const maxPages = Math.ceil(invoicesWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredInvoices: IInvoice[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (invoicesWithAppliedFilters[i]) {
        filteredInvoices.push(invoicesWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = (startDate && endDate) || status;

  return (
    <>
      {!isDataLoading ? (
        <Content>
          <div style={{ marginBottom: '32px' }}>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Search Invoice Number',
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
                  name: 'Status',
                  value: status,
                  setValue: setStatus,
                  values: [InvoiceStatuses.OPEN, InvoiceStatuses.OVERDUE, InvoiceStatuses.PAID],
                  isApplied: !!status,
                  ref: statusRef,
                  containLargeValues: true,
                  isDropdownVisible: isStatusVisible,
                  toggleIsVisible: toggleIsStatusVisible,
                },
              ]}
            />
            {filteredInvoices.length ? (
              <InvoicesTable
                invoices={filteredInvoices}
                setInvoiceToPay={setInvoiceToPay}
              />
            ) : (
              <NoFound />
            )}
          </div>
          {!!(invoices && invoices.length) && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={
              search || isFiltered
                ? invoicesWithAppliedFilters.length
                : invoices.length
            }
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
          )}
        </Content>
      ) : <Loader />}
      {!!invoiceToPay && (
        <Modal closeModal={() => setInvoiceToPay(undefined)}>
          <DeactivateModal
            title="Confirm your payment"
            subTitle={`Are you sure you want to pay <b>${invoiceToPay.invoiceNumber}</b> invoice?`}
            cancelButton={{
              onCancel: () => setInvoiceToPay(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => payNow(invoiceToPay!.orgId, invoiceToPay!.invoiceId, invoiceToPay!.invoiceNumber),
              name: 'Confirm',
              isLoading: isDataLoading,
              style: {
                style: { width: '90px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default InvoicesTab;
