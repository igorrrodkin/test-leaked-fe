import {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import ManualPaymentTable from '@/pages/billings/ManualPaymentTable';

import { billingActions, getInvoicesAction } from '@/store/actions/billingActions';
import { userActions } from '@/store/actions/userActions';

import { IInvoice, IPaymentCredits } from '@/store/reducers/billing';
import { PopupTypes } from '@/store/reducers/user';

import { selectInvoices } from '@/store/selectors/billingSelectors';

import useInput from '@/hooks/useInput';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import { api, AppDispatch } from '@/store';

const limits = [20, 50, 100];

type Allocation = { invoiceId: number, manualAllocation: number };

type ManualPaymentModalProps = {
  paymentCredit: IPaymentCredits;
  onClose: HandleToggle;
  handleRefresh: () => void;
};

const ManualPaymentModal: FC<ManualPaymentModalProps> = ({
  paymentCredit, onClose, handleRefresh,
}) => {
  useModalWindow();

  const dispatch = useDispatch<AppDispatch>();

  const invoices = useSelector(selectInvoices);

  const [search, setSearch] = useInput();

  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const [allocations, setAllocations] = useState<Record<number, Allocation>>({});

  const [isSaving, setIsSaving] = useToggle(false);
  const [isDataLoading, toggleIsDataLoading] = useToggle(false);

  const getData = async (id: number) => {
    try {
      toggleIsDataLoading(true);
      await dispatch(getInvoicesAction(id));
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
      }).sort((a, b) => +new Date(b.date) - +new Date(a.date)) || [],
    [search, invoices],
  );

  const maxPages = Math.ceil(invoicesWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;

  const filteredInvoices = useMemo(() => {
    if (maxPages >= 1) {
      const arr: IInvoice[] = [];
      for (
        let i = calculatedOffset * limits[limit];
        i < calculatedOffset * limits[limit] + limits[limit];
        i += 1
      ) {
        if (invoicesWithAppliedFilters[i]) {
          arr.push(invoicesWithAppliedFilters[i]);
        }
      }

      const test = arr.reduce<Record<number, Allocation>>((prev, curr) => {
        // eslint-disable-next-line no-param-reassign
        prev[curr.invoiceId] = { invoiceId: curr.invoiceId, manualAllocation: 0 };
        return prev;
      }, {});

      setAllocations(test);
      return arr;
    }

    return [];
  }, [maxPages, calculatedOffset, limits, limit, invoicesWithAppliedFilters]);

  const allocationsSum = useMemo(
    () => Object.values(allocations).reduce((prev, curr) => prev + curr.manualAllocation / 100, 0),
    [allocations],
  );

  const handleChangeAllocation = (id: number, amountVal: number) => {
    const currentAllocation = allocations[id];
    const newAllocation = { ...currentAllocation, manualAllocation: amountVal };

    setAllocations((prev) => ({ ...prev, [id]: newAllocation }));
  };

  const handlePayment = async () => {
    const bodyAllocations = Object.values(allocations).filter((allocation) => allocation.manualAllocation > 0);

    try {
      setIsSaving(true);
      await api.mainApiProtected.manualAllocate({
        creditId: paymentCredit.creditId,
        allocations: bodyAllocations.length ? bodyAllocations : undefined,
      });

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success Payment Allocation',
        additionalText: '',
      }));

      setIsSaving(false);
      handleRefresh();
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.isAxiosError ? err.message : 'Something went wrong';

      dispatch(userActions.setPopup({
        mainText: 'Error',
        additionalText: errorMessage,
        type: PopupTypes.ERROR,
      }));
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getData(paymentCredit.orgId);

    return () => {
      dispatch(billingActions.setInvoices(null));
    };
  }, [paymentCredit.orgId]);

  return (
    <Background close={() => onClose(false)}>
      <ModalWindow
        action="#"
        onClick={(evt) => evt.stopPropagation()}
      >
        {!isDataLoading ? (
          <>
            <Header>
              <PageTitle marginBottom="0">
                Allocate payment
              </PageTitle>
              <StyledCloseIcon handler={() => onClose(false)} />
            </Header>
            <Container>
              <Form>
                <Input
                  type="number"
                  label="Unallocated"
                  min={0}
                  value={((paymentCredit.credit / 100) - allocationsSum).toFixed(2)}
                  inputMarginBottom="0"
                  disabled
                />
              </Form>
              <div>
                <Filters
                  search={{
                    searchValue: search,
                    setSearchValue: setSearch,
                    placeholder: 'Search Invoice Number',
                    clear: () => setSearch(''),
                  }}
                />
                {filteredInvoices?.length && Object.keys(allocations).length
                  ? (
                    <ManualPaymentTable
                      invoices={filteredInvoices}
                      allocations={allocations}
                      handleChangeAllocation={handleChangeAllocation}
                    />
                  )
                  : <NoFound />}
              </div>
              {!!(invoices && invoices.length) && (
              <Pagination
                changePage={setOffset}
                currentPage={calculatedOffset}
                maxPages={maxPages}
                maxElements={
                search
                  ? invoicesWithAppliedFilters.length
                  : invoices.length
              }
                limits={limits}
                limit={limit}
                setLimit={setLimit}
              />
              )}
            </Container>
            <Buttons>
              <Button
                type="button"
                onClick={() => onClose(false)}
                disabled={isSaving}
                isCancel
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePayment}
                disabled={allocationsSum <= 0 || (paymentCredit.credit / 100) - allocationsSum < 0}
              >
                {isSaving ? (
                  <Loader size={24} thickness={2} color="#fff" />
                ) : (
                  'Allocate'
                )}
              </Button>
            </Buttons>
          </>
        ) : (
          <Loader />
        )}
      </ModalWindow>

    </Background>
  );
};

export default ManualPaymentModal;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const ModalWindow = styled.form`
  display: grid;
  grid-template-rows: auto minmax(50px, 1fr) auto;
  padding: 32px 0;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  min-height: 90vh;
  border-radius: 16px;
  background-color: #fff;
  cursor: default;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;
  margin-bottom: 32px;
  padding-left: 32px;
  padding-right: 32px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const Container = styled.div`
  padding-left: 32px;
  padding-right: 32px;

  margin-bottom: 32px;
  overflow-y: auto;
  width: calc(100% - 4px);
  scrollbar-color: rgba(163, 163, 163, 0.7);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(163, 163, 163, 0.7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    background: transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding-left: 32px;
  padding-right: 32px;
`;
