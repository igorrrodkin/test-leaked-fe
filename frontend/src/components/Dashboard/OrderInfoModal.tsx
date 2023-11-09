import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';
import PrintIcon from '@/assets/icons/PrintIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import OrderInfo from '@/components/Dashboard/OrderInfo';
import Loader from '@/components/Loader';

import {
  getOrderDetailsAction,
  userActions,
} from '@/store/actions/userActions';

import { selectOrderDetails } from '@/store/selectors/userSelectors';

import useModalWindow from '@/hooks/useModalWindow';
import { HandleToggle } from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

interface Props {
  orderId: string;
  close: HandleToggle;
}

const OrderInfoModal: React.FC<Props> = ({ orderId, close }) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const orderDetails = useSelector(selectOrderDetails);

  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  useEffect(() => {
    dispatch(getOrderDetailsAction(orderId));

    return () => {
      dispatch(userActions.setOrderDetails(null));
    };
  }, []);

  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <StyledBackground close={close}>
      <Container onClick={(evt) => evt.stopPropagation()} ref={componentRef}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
          <Title>
            Order Details
            <CloseIcon handler={close} />
          </Title>
          <OrderInfoWrapper>
            {orderDetails ? (
              <OrderInfo orderDetails={orderDetails} />
            ) : (
              <Loader />
            )}
          </OrderInfoWrapper>
        </div>
        <ButtonWrapper>
          <Print onClick={print}>
            <PrintIcon />
            Print
          </Print>
          <Button isCancel onClick={close}>
            Close
          </Button>
        </ButtonWrapper>
      </Container>
    </StyledBackground>
  );
};

const StyledBackground = styled(Background)`
  justify-content: flex-end;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 32px;
  padding: 20px 0;
  width: 350px;
  height: 90vh;
  min-height: 600px;
  border-radius: 12px;
  background-color: #fff;
  cursor: default;

  @media print {
    width: 100%;
  }
`;

const Title = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  padding: 0 24px 20px;
  border-bottom: 1px solid rgba(35, 35, 35, 0.16);

  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;

    @media print {
      display: none;
    }
  }
`;

const OrderInfoWrapper = styled.div`
  display: flex;
  flex: 1;
  & > div {
    padding-left: 24px;
    padding-right: 24px;
    border: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 24px;
  padding: 20px 24px 0;
  border-top: 1px solid rgba(35, 35, 35, 0.16);

  @media print {
    display: none;
  }
`;

const Print = styled.button`
  display: flex;
  align-items: center;
  grid-gap: 6px;
  padding: 8px 12px 8px 0;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.1s ease-in-out;
  background-color: transparent;

  :hover {
    color: var(--primary-green-hover-color);
  }
`;

export default OrderInfoModal;
