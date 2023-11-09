import React from 'react';
import styled from 'styled-components';

import getNounByForm from '@/utils/getNounByForm';

interface Props {
  pendingOrders: number;
}

const Status: React.FC<Props> = ({ pendingOrders }) => (
  <StatusStyled isPending={!!pendingOrders}>
    {pendingOrders ? getNounByForm(pendingOrders, 'Order') : 'None'}
  </StatusStyled>
);

const StatusStyled = styled.span<{ isPending: boolean }>`
  display: block;
  padding: 6px 12px;
  width: fit-content;
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  color: ${({ isPending }) => (isPending ? 'var(--primary-warning-color)' : '#ACB5BB')};
  border-radius: 100px;
  background-color: ${({ isPending }) => (isPending ? 'var(--primary-warning-background-color)' : 'transparent')};
  text-transform: ${({ isPending }) => (isPending ? 'uppercase' : 'auto')};
`;

export default Status;
