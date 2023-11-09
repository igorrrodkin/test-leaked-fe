import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from 'stripe';
import styled, { css } from 'styled-components';

import MasterCardIcon from '@/assets/icons/MasterCardIcon';
import VisaIcon from '@/assets/icons/VisaIcon';

import addZero from '@/utils/addZero';

interface ICardComponent {
  isPrime?: boolean;
  card: Stripe.PaymentMethod.Card;
  setPrimary: React.MouseEventHandler<HTMLButtonElement> | undefined;
  remove: React.MouseEventHandler<HTMLButtonElement>;
}

const Card: React.FC<ICardComponent> = ({
  isPrime,
  card,
  setPrimary,
  remove,
}) => {
  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa': {
        return <VisaIcon />;
      }
      case 'mastercard': {
        return <MasterCardIcon />;
      }
      default: return <VisaIcon />;
    }
  };

  return (
    <Wrap isPrime={isPrime}>
      <Row isMarginBottom>
        <IconColumn>
          {getCardIcon(card.brand)}
        </IconColumn>
        <div>
          <CardName>
            {card.brand}
            {' '}
            {`**** **** **** ${card.last4}`}
          </CardName>
          <ExpDate>{`Expiry ${addZero(card!.exp_month)}/${card.exp_year}`}</ExpDate>
        </div>
      </Row>
      <Row>
        <IconColumn />
        <div>
          <Row>
            <Btn
              onClick={!isPrime ? setPrimary : undefined}
              isActive={!isPrime}
            >
              {isPrime ? 'Primary' : 'Set as Primary'}
            </Btn>
            <Line />
            <Btn
              onClick={remove}
              isRed
            >
              Remove
            </Btn>
          </Row>
        </div>
      </Row>
    </Wrap>
  );
};

const Wrap = styled.div<{ isPrime?: boolean }>`
  padding: 24px;
  background: ${({ isPrime }) => (isPrime ? '#EEFDF1' : '#ffffff')};
  border: 1px solid #dce4e8;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const Row = styled.div<{ isMarginBottom?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ isMarginBottom }) => (isMarginBottom ? '18px' : 0)};
`;

const IconColumn = styled.div`
  flex: 0 0 70px;
  width: 70px;
  margin-right: 18px;
`;

const CardName = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 6px;
  text-transform: capitalize;
`;

const ExpDate = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #6c7278;
`;

const Btn = styled.button<{ isActive?: boolean, isRed?: boolean }>`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.03em;
  transition: color .1s ease-in-out;
  background-color: transparent;
  border: none;
  
  ${({ isActive = true, isRed }) => css`
    color: ${isRed ? 'var(--primary-red-color)' : 'var(--primary-green-color)'};
    cursor: ${isActive ? 'pointer' : 'default'};
    
    ${isActive && css`
      :hover {
        color: ${isRed ? 'var(--primary-red-hover-color)' : 'var(--primary-green-hover-color)'}
      }
    `}
  `}
`;

const Line = styled.div`
  flex: 0 0 1px;
  width: 1px;
  height: 15px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 24px;
`;

export default Card;
