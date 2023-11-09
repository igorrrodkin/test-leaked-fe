import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import PageTitle from '@/components/PageTitle';

import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';
import useModalWindow from '@/hooks/useModalWindow';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import { api } from '@/store';

import Input from '../Input';
import Loader from '../Loader';
import Select from '../Select';

type SummaryModalProps = {
  currentBalance: number;
  cards: {
    id: string;
    last4: string;
    brand: string;
    default: boolean;
  }[];
  onClose: HandleToggle;
  getData: () => Promise<void>;
};

export const SummaryModal: FC<SummaryModalProps> = ({
  currentBalance, cards, onClose, getData,
}) => {
  useModalWindow();

  const dispatch = useDispatch();

  const [error, setError] = useState('');
  const [amount, setAmount] = useInput('');
  const [isSaving, setIsSaving] = useToggle(false);
  const [selectedCard, setSelectedCard] = useState<number>(() => cards.findIndex((card) => card.default));

  const cardsNames = cards.map((card) => `${card.brand.slice(0, 1).toUpperCase()}${card.brand.slice(1)} **** ${card.last4}`);

  const handlePayment = async () => {
    const bodyAmount = +amount;

    if (!amount || Number.isNaN(bodyAmount)) {
      setError('Enter number');
      return;
    }

    if (selectedCard === undefined) {
      setError('Select card');
      return;
    }

    try {
      setIsSaving(true);

      await api.mainApiProtected.merchantPayment({ amount: bodyAmount * 100, paymentMethodId: cards[selectedCard].id });

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Payment is successful',
        additionalText: '',
      }));
      getData();
      setIsSaving(false);
      onClose(true);
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

  return (
    <Background close={() => onClose(false)}>
      <ModalWindow
        action="#"
        onClick={(evt) => evt.stopPropagation()}
      >
        <Header>
          <PageTitle marginBottom="0">
            Merchant payment
          </PageTitle>
          <StyledCloseIcon handler={() => onClose(false)} />
        </Header>
        <Container>
          <Form>
            <CustomSelect>
              <Label>
                Payment method
              </Label>
              <Select
                items={cardsNames}
                selectedItem={selectedCard}
                setSelectedItem={setSelectedCard}
                placeholder="Card"
                fontSize="16px"
                textOverflow
                useToggle
              />
            </CustomSelect>
            <Input
              disabled
              type="number"
              label="Amount Owing"
              inputMarginBottom="0"
              value={currentBalance < 0 ? '0.00' : (currentBalance / 100).toFixed(2)}
            />
            <Input
              type="number"
              label="Amount"
              value={amount}
              min={5}
              max={25000}
              onChange={setAmount}
              inputMarginBottom="0"
            />
          </Form>
          {error && <p>{error}</p>}
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
            disabled={!amount || selectedCard === undefined || +amount < 5 || +amount > 25000}
            onClick={handlePayment}
          >
            {isSaving ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Make payment'
            )}
          </Button>
        </Buttons>
      </ModalWindow>
    </Background>
  );
};

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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
`;

const CustomSelect = styled.div`
`;

const Label = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  margin: 0 0 16px 0;
  color: #6C7278;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding-left: 32px;
  padding-right: 32px;
`;
