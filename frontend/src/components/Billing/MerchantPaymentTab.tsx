import { FC, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Content } from '@/pages/Notices';

import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';

import { api } from '@/store';

import Button from '../Button';
import Input from '../Input';

const MerchantPaymentTab: FC = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState('');
  const [amount, setAmount] = useInput('');

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bodyAmount = +amount;

    if (!amount || Number.isNaN(bodyAmount)) {
      setError('Enter number');
      return;
    }

    try {
      await api.mainApiProtected.merchantPayment({ amount: bodyAmount * 100 });

      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Payment is successful',
        additionalText: '',
      }));
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.isAxiosError ? err.message : 'Something went wrong';

      dispatch(userActions.setPopup({
        mainText: 'Error',
        additionalText: errorMessage,
        type: PopupTypes.ERROR,
      }));
    }
  };

  return (
    <Content>
      <From onSubmit={formSubmitHandler}>
        <Input type="number" label="Amount" isRequired value={amount} onChange={setAmount} inputMarginBottom="0" />
        <Button type="submit" disabled={!amount}>Make Payment</Button>
      </From>
      {error && <p>{error}</p>}
    </Content>
  );
};

export default MerchantPaymentTab;

const From = styled.form`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
`;
