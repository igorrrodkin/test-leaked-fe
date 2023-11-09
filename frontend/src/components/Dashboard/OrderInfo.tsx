import React from 'react';
import styled from 'styled-components';

import { OrderDetails } from '@/store/reducers/user';

import convertCamelCaseToNormalValue from '@/utils/convertCamelCaseToNormalValue';
import convertTimestamp from '@/utils/convertTimestamp';
import toSentenceCase from '@/utils/toSentenceCase';

interface IOrderInfoComponent {
  orderDetails: OrderDetails;
}

const OrderInfo: React.FC<IOrderInfoComponent> = ({ orderDetails }) => (
  <OrderInfoWrap>
    <div>
      <SubTitle>Details</SubTitle>
      <OrderInfoItem>
        <ItemName>Service</ItemName>
        <ItemValue>{orderDetails.service}</ItemValue>
      </OrderInfoItem>
      {Object.entries(orderDetails.orderItems[0].input).map(
        ([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <OrderInfoItem key={key + value[0]}>
                <ItemName>{convertCamelCaseToNormalValue(key)}</ItemName>
                <ItemValue>{value[0].link}</ItemValue>
              </OrderInfoItem>
            );
          }

          if (key !== 'matterReference') {
            return (
              <OrderInfoItem key={key + value}>
                <ItemName>{convertCamelCaseToNormalValue(key)}</ItemName>
                <ItemValue>{value}</ItemValue>
              </OrderInfoItem>
            );
          }

          return '';
        },
      )}
      <OrderInfoItem>
        <ItemName>Description</ItemName>
        <ItemValue>{orderDetails.description}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Order ID</ItemName>
        <ItemValue>{orderDetails.id}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Matter</ItemName>
        <ItemValue>{orderDetails.matter}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Date Ordered</ItemName>
        <ItemValue>{convertTimestamp(orderDetails.createdAt)}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Completed</ItemName>
        <ItemValue>{convertTimestamp(orderDetails.updatedAt)}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Status</ItemName>
        <ItemValue>{toSentenceCase(orderDetails.status)}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Status Description</ItemName>
        <ItemValue>{toSentenceCase(orderDetails.statusDescription)}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>User</ItemName>
        <ItemValue>{orderDetails.userName}</ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Organisation</ItemName>
        <ItemValue>{orderDetails.organisation}</ItemValue>
      </OrderInfoItem>
    </div>
    <div>
      <SubTitle>Fee Details</SubTitle>
      <OrderInfoItem>
        <ItemName>Total Fee</ItemName>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Ex. GST</ItemName>
        <ItemValue>
          $
          {Number(+orderDetails.exGST / 100).toFixed(2)}
        </ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>GST</ItemName>
        <ItemValue>
          $
          {Number(+orderDetails.GST / 100).toFixed(2)}
        </ItemValue>
      </OrderInfoItem>
      <OrderInfoItem>
        <ItemName>Total</ItemName>
        <ItemValue>
          $
          {Number(+orderDetails.totalPrice / 100).toFixed(2)}
        </ItemValue>
      </OrderInfoItem>
    </div>
  </OrderInfoWrap>
);

const OrderInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
  padding: 24px;
  border: 1px solid #dce4e8;
  border-radius: 12px;
`;

const SubTitle = styled.h4`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
`;

const OrderInfoItem = styled.p`
  display: grid;
  grid-template-columns: 3fr 4fr;
  grid-gap: 24px;

  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const ItemName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6c7278;
  text-transform: capitalize;
`;

const ItemValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  word-break: break-all;
`;

export default OrderInfo;
