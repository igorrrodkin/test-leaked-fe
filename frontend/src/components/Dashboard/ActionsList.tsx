import React from 'react';
import styled, { css } from 'styled-components';

import CancelOrderIcon from '@/assets/icons/CancelOrderIcon';
import SwapIcon from '@/assets/icons/SwapIcon';

import { OrderStatusEnum } from '@/store/reducers/user';

import useClickOutside from '@/hooks/useClickOutside';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

interface Props {
  isLast: boolean;
  isFirst?: boolean;
  cancelHandler: HandleToggle;
  refundHandler: HandleToggle;
  status: OrderStatusEnum;
}

const ActionsList: React.FC<Props> = ({
  isLast,
  isFirst,
  refundHandler,
  cancelHandler,
  status,
}) => {
  const [isVisible, toggleIsVisible] = useToggle();
  const ref = useClickOutside(() => toggleIsVisible(false));

  return (
    <Dots ref={ref} onClick={toggleIsVisible}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.99984 6.66675C3.2665 6.66675 2.6665 7.26675 2.6665 8.00008C2.6665 8.73341 3.2665 9.33341 3.99984 9.33341C4.73317 9.33341 5.33317 8.73341 5.33317 8.00008C5.33317 7.26675 4.73317 6.66675 3.99984 6.66675ZM11.9998 6.66675C11.2665 6.66675 10.6665 7.26675 10.6665 8.00008C10.6665 8.73341 11.2665 9.33341 11.9998 9.33341C12.7332 9.33341 13.3332 8.73341 13.3332 8.00008C13.3332 7.26675 12.7332 6.66675 11.9998 6.66675ZM7.99984 6.66675C7.2665 6.66675 6.6665 7.26675 6.6665 8.00008C6.6665 8.73341 7.2665 9.33341 7.99984 9.33341C8.73317 9.33341 9.33317 8.73341 9.33317 8.00008C9.33317 7.26675 8.73317 6.66675 7.99984 6.66675Z"
          fill="#1A1C1E"
        />
      </svg>
      {isVisible ? (
        <List
          isLast={isLast}
          isFirst={isFirst}
          onClick={(evt) => evt.stopPropagation()}
        >
          <ListItem
            isDisabled={status !== OrderStatusEnum.COMPLETE}
            onClick={status === OrderStatusEnum.COMPLETE ? refundHandler : undefined}
          >
            <SwapIcon />
            Refund Order
          </ListItem>
          <ListItem
            isDisabled={!(status === OrderStatusEnum.IN_PROGRESS || status === OrderStatusEnum.OPEN)}
            onClick={
              !(status === OrderStatusEnum.IN_PROGRESS || status === OrderStatusEnum.OPEN) ? undefined : cancelHandler
            }
          >
            <CancelOrderIcon />
            Cancel Order
          </ListItem>
        </List>
      ) : (
        ''
      )}
    </Dots>
  );
};

const Dots = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  cursor: pointer;

  :hover > svg path {
    fill: rgba(26, 28, 30, 0.6);
  }
`;

const List = styled.div<{ isLast: boolean; isFirst?: boolean }>`
  position: absolute;
  ${({ isLast }) => (isLast ? 'bottom: calc(100% + 12px)' : 'top: calc(100% + 12px)')};
  right: 0;
  padding: 16px;
  border-radius: ${({ isLast }) => (isLast ? '12px 12px 2px 12px' : '12px 2px 12px 12px')};
  background-color: #fff;
  box-shadow: 8px 8px 44px rgba(0, 0, 0, 0.1);
  z-index: 10;

  ${({ isFirst }) => isFirst
    && css`
      top: -45px;
      bottom: -15px;
      right: 30px;
    `};
`;

const ListItem = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  grid-gap: 8px;
  color: var(--primary-red-color);
  font-weight: 500;
  cursor: pointer;

  :hover {
    color: var(--primary-red-hover-color);

    path {
      stroke: var(--primary-red-hover-color);
    }
  }

  :not(:last-child) {
    margin-bottom: 20px;
  }

  ${({ isDisabled }) => (isDisabled
    ? css`
          color: #dce4e8;
          cursor: default;
          user-select: none;

          path {
            stroke: #dce4e8;
          }

          :hover {
            color: #dce4e8;

            path {
              stroke: #dce4e8;
            }
          }
        `
    : '')}
`;

export default ActionsList;
