import React, {
  ChangeEvent,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementChangeEvent } from '@stripe/stripe-js';
import styled from 'styled-components';

import CardInputWrapper from '@/components/Billing/CardInputWrapper';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import UsersBlock from '@/components/Settings/Users/UsersBlock';

import { attachPaymentMethodToCustomerAction, userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

const SettingsAddNewCard: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [cardOwnerName, setCardOwnerName] = useInput();
  const [showCardNameError, toggleShowCardNameError] = useToggle();
  const [isCardNumberError, setIsCardNumberError] = useState<string | undefined>();
  const [isCardExpiryError, setIsCardExpiryError] = useState<string | undefined>();
  const [isCardCVCError, setIsCardCVCError] = useState<string | undefined>();
  const [isLoading, toggleIsLoading] = useToggle();

  const user = useSelector(selectUser);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const onCardOwnerNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    toggleShowCardNameError(false);
    setCardOwnerName(evt.target.value);
  };

  const handleCancelClick = () => {
    navigate(-1);
  };

  const handleSaveCard = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      if (isOwnerNameRequestError) {
        toggleShowCardNameError(true);
        return;
      }
      if (!elements || !stripe || !user || isLoading) return;

      toggleIsLoading(true);

      const numberEl = elements.getElement(CardNumberElement)!;
      await elements.submit();
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: numberEl,
        billing_details: {
          name: cardOwnerName,
        },
      });

      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        if (isOwnerNameRequestError) toggleShowCardNameError(true);

        if (result.error.type !== 'validation_error') {
          dispatch(userActions.setPopup({
            type: PopupTypes.ERROR,
            mainText: 'Error',
            additionalText: result.error.message || 'Something went wrong',
          }));
        }
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.

        await dispatch(attachPaymentMethodToCustomerAction(result.paymentMethod.id, user.organisations[0]));

        dispatch(userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success',
          additionalText: `Payment method **** **** **** ${result.paymentMethod.card!.last4} have been added`,
        }));

        navigate('/settings/billing');
      }

      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const onCardNumberChange = (evt: StripeElementChangeEvent) => {
    if (evt.error?.message) {
      setIsCardNumberError(evt.error.message);
      return;
    }

    setIsCardNumberError(undefined);
  };

  const onCardExpiryChange = (evt: StripeElementChangeEvent) => {
    if (evt.error?.message) {
      setIsCardExpiryError(evt.error.message);
      return;
    }

    setIsCardExpiryError(undefined);
  };

  const onCardCvcChange = (evt: StripeElementChangeEvent) => {
    if (evt.error?.message) {
      setIsCardCVCError(evt.error.message);
      return;
    }

    setIsCardCVCError(undefined);
  };

  const isOwnerNameValidationError = !!cardOwnerName
    .replace(/[a-zA-Z]/g, '')
    .replace(/['-]/g, '')
    .replace(/ /g, '')
    .length;

  const isOwnerNameRequestError = isOwnerNameValidationError || !cardOwnerName.length;

  return (
    <Wrap
      ref={formRef}
      onSubmit={handleSaveCard}
    >
      <UsersBlock title="Add New Card">
        <Row>
          <CardsTitle>Card details</CardsTitle>
          <Inputs>
            <Input
              type="text"
              label="Name on Card"
              labelMarginBottom={12}
              placeholder="Your First and Last name"
              value={cardOwnerName}
              onChange={onCardOwnerNameChange}
              inputMarginBottom="0"
              isError={isOwnerNameRequestError && showCardNameError}
              errorMessage="Invalid value."
              onBlur={() => {
                toggleShowCardNameError(cardOwnerName ? isOwnerNameRequestError : false);
              }}
            />
            <CardInputWrapper
              label="Expiry"
              isError={isCardExpiryError}
            >
              <CardExpiryElement options={options} onChange={onCardExpiryChange} />
            </CardInputWrapper>
            <CardInputWrapper
              label="Card Number"
              isError={isCardNumberError}
            >
              <CardNumberElement options={cardNumberOptions} onChange={onCardNumberChange} />
            </CardInputWrapper>
            <CardInputWrapper
              label="CVC"
              isError={isCardCVCError}
            >
              <CardCvcElement options={options} onChange={onCardCvcChange} />
            </CardInputWrapper>
          </Inputs>
        </Row>
      </UsersBlock>
      <Buttons>
        <Button
          isCancel
          type="button"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          width="140px"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader size={24} thickness={2} color="#fff" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </Buttons>
    </Wrap>
  );
};

const Wrap = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 78px;
  margin: 40px 0;
`;

const Inputs = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 412px) minmax(80px, 120px);
  row-gap: 42px;
  column-gap: 24px;
`;

const CardsTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: #1a1c1e;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  grid-gap: 16px;
`;

const options = {
  style: {
    base: {
      fontSize: '12px',
      color: '#1A1C1E',
      '::placeholder': {
        fontSize: '12px',
      },
    },
    invalid: {
      color: '#1A1C1E',
    },
  },
};

const cardNumberOptions = {
  ...options,
  showIcon: true,
};

const stripePromise = async () => await loadStripe(process.env.STRIPE_PK);

const StripeWrapper = () => (
  <Elements stripe={stripePromise()}>
    <SettingsAddNewCard />
  </Elements>
);

export default StripeWrapper;
