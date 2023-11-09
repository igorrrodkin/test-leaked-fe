import React from 'react';
import styled, { css } from 'styled-components';

import { OrderStatusEnum } from '@/store/reducers/user';

import { TabularOrderStatus } from '@/utils/getOrderStatus';

interface Props {
  status: TabularOrderStatus
}

const Status: React.FC<Props> = ({ status }) => (
  <StatusStyled orderStatus={status}>
    {status}
  </StatusStyled>
);

const StatusStyled = styled.span<{ orderStatus: TabularOrderStatus }>`
  display: block;
  padding: 4px 6px;
  width: fit-content;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6c7278;
  text-align: center;
  background-color: #edf1f3;

  ${({ orderStatus }) => {
    if (orderStatus === OrderStatusEnum.ERROR) {
      return css`
        background-color: var(--primary-red-background-color);
        color: var(--primary-red-color);
      `;
    }
    if (orderStatus === OrderStatusEnum.COMPLETE) {
      return css`
        background-color: var(--primary-green-background-color);
        color: var(--primary-green-color);
      `;
    }
    if (orderStatus === OrderStatusEnum.IN_PROGRESS) {
      return css`
        background-color: var(--primary-warning-background-color);
        color: var(--primary-warning-color);
      `;
    }
  }}
`;

export default Status;
