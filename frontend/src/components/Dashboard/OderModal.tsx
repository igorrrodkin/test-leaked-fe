import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import OrderInfo from '@/components/Dashboard/OrderInfo';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';

import { updateOrderStatusAction } from '@/store/actions/orderActions';
import {
  getOrderDetailsAction,
  userActions,
} from '@/store/actions/userActions';

import { OrderStatusEnum } from '@/store/reducers/user';

import {
  selectOrderDetails,
  selectOrders,
} from '@/store/selectors/userSelectors';

import useModalWindow from '@/hooks/useModalWindow';
import { HandleToggle } from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

interface Props {
  isCancel?: boolean;
  orderId: string;
  onClose: HandleToggle;
}

const OderModal: React.FC<Props> = ({ orderId, onClose, isCancel = false }) => {
  const [isSaving, setIsSaving] = useState(false);

  const orderDetails = useSelector(selectOrderDetails);
  const orders = useSelector(selectOrders);

  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  useEffect(() => {
    if (!orderDetails) {
      dispatch(getOrderDetailsAction(orderId));
    }

    return () => {
      dispatch(userActions.setOrderDetails(null));
    };
  }, []);

  const handleRefundOrder = async () => {
    setIsSaving(true);

    const orderStatus = isCancel
      ? OrderStatusEnum.CANCELLED
      : OrderStatusEnum.REFUNDED;

    await dispatch(updateOrderStatusAction(
      orderId,
      {
        status: orderStatus,
        orgId: orderDetails!.orgId,
      },
    ));

    const updatedOrders = orders.map(
      (order) => (order.id === orderId
        ? {
          ...order,
          status: isCancel
            ? OrderStatusEnum.CANCELLED
            : OrderStatusEnum.REFUNDED,
        }
        : order),
      [],
    );

    dispatch(userActions.setOrders(updatedOrders));

    setIsSaving(false);
    onClose(true);
  };

  return (
    <Background close={onClose}>
      {orderDetails ? (
        <ModalWindow onClick={(evt) => evt.stopPropagation()}>
          <Header>
            <PageTitle marginBottom="0">
              {isCancel ? 'Cancel Order?' : 'Refund Order?'}
            </PageTitle>
            <StyledCloseIcon handler={onClose} />
          </Header>
          <SubTitle>
            {`Are you sure you want to ${
              isCancel ? 'cancel' : 'refund'
            } the order?`}

          </SubTitle>
          <InputsContainer>
            <OrderInfo orderDetails={orderDetails} />
          </InputsContainer>
          <Buttons>
            <Button onClick={onClose} isCancel>
              {isCancel ? 'No' : 'Cancel'}
            </Button>
            <Button onClick={handleRefundOrder} isRedButton>
              {isSaving ? (
                <Loader size={24} thickness={2} color="#fff" />
              ) : (
                `${isCancel ? 'Yes' : 'Refund'}`
              )}
            </Button>
          </Buttons>
        </ModalWindow>
      ) : (
        <Loader color="#fff" />
      )}
    </Background>
  );
};

const ModalWindow = styled.div`
  max-width: 660px;
  min-width: 500px;
  max-height: 90vh;
  min-height: 600px;
  padding: 32px;
  border-radius: 16px;
  background-color: #fff;
  cursor: default;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const SubTitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  letter-spacing: -0.01em;
  color: #111827;
  opacity: 0.7;
  margin: 24px 0;
`;

const InputsContainer = styled.div`
  margin-bottom: 32px;
  overflow-y: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
`;

export default OderModal;
