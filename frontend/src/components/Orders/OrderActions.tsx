import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import UploadFileIcon from '@/assets/icons/UploadFileIcon';

import ActionsList from '@/components/Dashboard/ActionsList';

import { EOrderItemType } from '@/store/reducers/order';
import { Order, OrderStatusEnum, Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

interface Props {
  order: Order;
  setAttachOrderId: (orderId: string) => void;
  setOrderPreviewId: (orderId: string) => void;
  refundHandler: (orderId: string) => void;
  cancelOrderHandler: (orderId: string) => void;
  isLast: boolean,
  isFirst: boolean,
}

const OrderActions: React.FC<Props> = ({
  order,
  setAttachOrderId,
  setOrderPreviewId,
  refundHandler,
  cancelOrderHandler,
  isLast,
  isFirst,
}) => {
  const user = useSelector(selectUser);

  const handleSetAttachOrderId = () => {
    setAttachOrderId(order.id);
  };

  const handleSetOrderPreviewId = () => {
    setOrderPreviewId(order.id);
  };

  const handleRefundHandler = () => {
    refundHandler(order.id);
  };

  const handleCancelOrderHandler = () => {
    cancelOrderHandler(order.id);
  };

  return (
    <ActionCell onClick={(evt) => evt.stopPropagation()}>
      {user!.role === Roles.SYSTEM_ADMIN && (
        <Info
          onClick={handleSetAttachOrderId}
          isDisabled={(order.status !== OrderStatusEnum.COMPLETE
            && order.status !== OrderStatusEnum.OPEN
            && order.status !== OrderStatusEnum.IN_PROGRESS)
            || (order.status === OrderStatusEnum.COMPLETE
              && order.orderItems[0]?.itemType === EOrderItemType.SEARCH)}
          disabled={(order.status !== OrderStatusEnum.COMPLETE
            && order.status !== OrderStatusEnum.OPEN
            && order.status !== OrderStatusEnum.IN_PROGRESS)
            || (order.status === OrderStatusEnum.COMPLETE
              && order.orderItems[0]?.itemType === EOrderItemType.SEARCH)}
        >
          <UploadFileIcon />
        </Info>
      )}
      <Info onClick={handleSetOrderPreviewId}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00004 1.33301C4.32004 1.33301 1.33337 4.31967 1.33337 7.99967C1.33337 11.6797 4.32004 14.6663 8.00004 14.6663C11.68 14.6663 14.6667 11.6797 14.6667 7.99967C14.6667 4.31967 11.68 1.33301 8.00004 1.33301ZM8.00004 11.333C7.63337 11.333 7.33337 11.033 7.33337 10.6663V7.99967C7.33337 7.63301 7.63337 7.33301 8.00004 7.33301C8.36671 7.33301 8.66671 7.63301 8.66671 7.99967V10.6663C8.66671 11.033 8.36671 11.333 8.00004 11.333ZM8.66671 5.99967H7.33337V4.66634H8.66671V5.99967Z"
            fill="#1A1C1E"
          />
        </svg>
      </Info>
      {user!.role === Roles.SYSTEM_ADMIN && (
        <ActionsList
          isLast={isLast}
          isFirst={isFirst}
          refundHandler={handleRefundHandler}
          cancelHandler={handleCancelOrderHandler}
          status={order.status}
        />
      )}
    </ActionCell>
  );
};

const Info = styled.button<{ isDisabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border-style: none;
  background-color: #f1efe9;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : 1)};
  cursor: pointer;

  :hover {
    background-color: ${({ isDisabled }) => (isDisabled ? '#f1efe9' : '#e1dfd9')};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 12px;
`;

export default OrderActions;
