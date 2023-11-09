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
import PageTitle from '@/components/PageTitle';
import Select from '@/components/Select';
import { SelectOrganization } from '@/components/SelectOrganization';

import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';

import useInput from '@/hooks/useInput';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import { api } from '@/store';

const paymentMethods = ['Card', 'EFT'];

type WithdrawModalProps = {
  onClose: HandleToggle;
  handleRefresh: () => void;
};

const WithdrawModal: FC<WithdrawModalProps> = ({ onClose, handleRefresh }) => {
  useModalWindow();

  const dispatch = useDispatch();

  const organisations = useSelector(selectBaseOrganisationsInfo);

  const [error, setError] = useState('');
  const [amount, setAmount] = useInput('');
  const [isSaving, setIsSaving] = useToggle(false);
  const [description, setDescription] = useInput('');
  const [selectedOrg, setSelectedOrg] = useState<number>();
  const [isDataLoading, toggleIsDataLoading] = useToggle(false);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState(undefined);

  const sortedOrganization = useMemo(
    () => organisations.slice(0, organisations.length).sort((a, b) => a.name.localeCompare(b.name)),
    [organisations],
  );

  const handlePayment = async () => {
    if (amount && selectedMethod !== undefined) {
      const bodyAmount = +amount;

      if (!amount || Number.isNaN(bodyAmount)) {
        setError('Enter number');
        return;
      }

      if (!selectedOrg) {
        setError('Choose Organization');
        return;
      }

      try {
        setIsSaving(true);
        await api.mainApiProtected.withdraw({
          withdrawAmount: bodyAmount * 100,
          orgId: selectedOrg,
          paymentType: paymentMethods[selectedMethod],
          description,
        });

        dispatch(userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success withdraw',
          additionalText: '',
        }));
        setAmount('');
        setSelectedMethod(undefined);
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
    }
  };

  useEffect(() => {
    const getPaymentBalance = async (orgId: number) => {
      try {
        toggleIsDataLoading(true);
        const response = await api.mainApiProtected.getPaymentBalance(orgId);
        setCreditBalance(response.credit);
        toggleIsDataLoading(false);
      } catch (err: any) {
        console.error(err);
        const errorMessage = err.isAxiosError ? err.message : 'Something went wrong';

        dispatch(userActions.setPopup({
          mainText: 'Error',
          additionalText: errorMessage,
          type: PopupTypes.ERROR,
        }));
        toggleIsDataLoading(true);
      }
    };

    if (selectedOrg) {
      getPaymentBalance(selectedOrg);
    }
  }, [selectedOrg]);

  return (
    <Background close={() => onClose(false)}>
      <ModalWindow
        action="#"
        onClick={(evt) => evt.stopPropagation()}
      >
        <Header>
          <PageTitle marginBottom="0">
            Withdrawal
          </PageTitle>
          <StyledCloseIcon handler={() => onClose(false)} />
        </Header>
        <Container>
          {!isDataLoading ? (
            <div>
              <div style={{ marginBottom: '20px', maxWidth: '250px' }}>
                <SelectOrganization
                  useToggle
                  textOverflow
                  fontSize="16px"
                  placeholder="Organisation"
                  items={sortedOrganization}
                  selectedItem={selectedOrg}
                  setSelectedItem={setSelectedOrg}
                />
              </div>
              <Form>
                <FormWrapper>
                  <Label>
                    Payment Method
                  </Label>
                  <Select
                    useToggle
                    items={paymentMethods}
                    placeholder="Select method"
                    selectedItem={selectedMethod}
                    setSelectedItem={setSelectedMethod}
                  />
                  <Input
                    type="number"
                    label="Credit"
                    value={(creditBalance / 100).toFixed(2)}
                    inputMarginBottom="0"
                    disabled
                  />
                  <Input
                    type="text"
                    label="Description"
                    value={description}
                    inputMarginBottom="0"
                    onChange={setDescription}
                  />
                  <Input
                    type="number"
                    label="Withdraw Amount"
                    value={amount}
                    max={creditBalance / 100}
                    min={0}
                    onChange={setAmount}
                    inputMarginBottom="0"
                  />
                </FormWrapper>
              </Form>
              {error && <p>{error}</p>}
            </div>
          ) : (
            <LoaderWrapper>
              <Loader />
            </LoaderWrapper>
          ) }
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
            disabled={!amount || selectedMethod === undefined || +amount > creditBalance / 100 || +amount < 0}
            onClick={handlePayment}
          >
            {isSaving ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Withdraw'
            )}
          </Button>
        </Buttons>
      </ModalWindow>
    </Background>
  );
};

export default WithdrawModal;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #6c7278;
  row-gap: 12px;
  font-size: 16px;
  font-weight: 500;
`;

const ModalWindow = styled.form`
  display: grid;
  grid-template-rows: auto minmax(50px, 1fr) auto;
  padding: 32px 0;
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  min-height: 600px;
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

const LoaderWrapper = styled.div`
  height: 100%;
  display: flex;
  alig-items: center;
  justify-content: center;
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
