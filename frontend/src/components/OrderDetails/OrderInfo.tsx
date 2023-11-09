import React from 'react';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import { OrderDetails } from '@/store/reducers/user';

import { HandleToggle } from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import toSentenceCase from '@/utils/toSentenceCase';

interface Props {
  order: OrderDetails,
  close: HandleToggle
}

const OrderInfo: React.FC<Props> = ({ order, close }) => (
  <DetailsBlockGrid>
    <div>
      <H4>Details</H4>
      <DetailsGrid>
        <DetailName>Service</DetailName>
        <DetailValue>{order.service}</DetailValue>
        <DetailName>Description</DetailName>
        <DetailValue>{order.description}</DetailValue>
        <DetailName>Order ID</DetailName>
        <DetailValue>{order.id}</DetailValue>
        <DetailName>Matter</DetailName>
        <DetailValue>{order.matter}</DetailValue>
        <DetailName>Date Ordered</DetailName>
        <DetailValue>
          {convertTimestamp(+order.createdAt, true)}
        </DetailValue>
        <DetailName>Completed</DetailName>
        <DetailValue>
          {convertTimestamp(+order.createdAt, true)}
        </DetailValue>
        <DetailName>Status</DetailName>
        <DetailValue>
          {toSentenceCase(order.status)}
        </DetailValue>
        <DetailName>Status Description</DetailName>
        <DetailValue>
          {toSentenceCase(order.statusDescription)}
        </DetailValue>
        <DetailName>User</DetailName>
        <DetailValue>{order.userName}</DetailValue>
        <DetailName>Organisation</DetailName>
        <DetailValue>{order.organisation}</DetailValue>
      </DetailsGrid>
    </div>
    <div>
      <H4>
        Fee Details
        <CloseIcon handler={close} />
      </H4>
      <FeeDetailsGrid>
        <DetailName>Total Fee</DetailName>
        <DetailValue />
        <DetailName>Ex. GST</DetailName>
        <DetailValue>
          $
          {Number(+order.exGST / 100).toFixed(2)}
        </DetailValue>
        <DetailName>GST</DetailName>
        <DetailValue>
          $
          {Number(+order.GST / 100).toFixed(2)}
        </DetailValue>
        <DetailName>Total</DetailName>
        <DetailValue>
          $
          {Number(+order.totalPrice / 100).toFixed(2)}
        </DetailValue>
      </FeeDetailsGrid>
    </div>
  </DetailsBlockGrid>
);

const DetailsBlockGrid = styled.div`
  display: grid;
  grid-template-columns: 7fr 5fr;
  grid-gap: 24px;
`;

const H4 = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
    cursor: pointer;

    * {
      stroke: #acb5bb;
    }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 7fr;
  grid-gap: 8px;
`;

const FeeDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 7fr 5fr;
  grid-gap: 8px;
`;

const DetailName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6c7278;
`;

const DetailValue = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

export default OrderInfo;
