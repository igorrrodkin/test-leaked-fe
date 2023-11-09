import React, { FC, HTMLAttributes } from 'react';
import { useNavigate } from 'react-router';
import base64 from 'base-64';
import styled from 'styled-components';

import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';

import Checkbox from '@/components/Checkbox';

import { OrderItems } from '@/store/reducers/user';

import useToggle from '@/hooks/useToggle';

interface Props extends HTMLAttributes<HTMLDivElement> {
  description?: string,
  orderItem: OrderItems,
  selectedLinks: number[],
  isPreview: boolean,
  linkPreview: number | null,
  baseRoute: string,
  checkboxClickHandler: Function,
}

const OrderItem: FC<Props> = ({
  description = '',
  orderItem,
  selectedLinks,
  isPreview,
  linkPreview,
  baseRoute,
  checkboxClickHandler,
  ...props
}) => {
  const [isDropdownVisible, toggleIsDropdownVisible] = useToggle();

  const navigate = useNavigate();

  const onItemClick = (index: number = 0, shouldToggle = true) => {
    let query = `orderId=${orderItem.orderId}`;

    if (orderItem.fileKeys[index]) {
      query += `&linkId=${index}`;
    }

    navigate({
      search: base64.encode(query),
    });

    if (shouldToggle) toggleIsDropdownVisible(!isDropdownVisible);
  };

  const isWithFiles = !!(orderItem.fileKeys && orderItem.fileKeys.length);

  return (
    <>
      <StyledOrderItem
        {...props}
        isSelected={isWithFiles && orderItem.fileKeys.length === selectedLinks.length}
        isPreview={isPreview}
        onClick={() => onItemClick()}
      >
        <LeftSide>
          <Checkbox
            type="checkbox"
            disabled={!isWithFiles}
            checked={isWithFiles && orderItem.fileKeys.length === selectedLinks.length}
            onChange={({ target }) => {
              if (isWithFiles) {
                checkboxClickHandler(target.checked, orderItem.orderId);
              }
            }}
          />
          <div>
            <OrderItemTitle>{orderItem.service}</OrderItemTitle>
            <OrderItemInfo>{description}</OrderItemInfo>
          </div>
        </LeftSide>
        {isWithFiles && orderItem.fileKeys.length > 1 && (
          <StyledRightIcon isSelected={isDropdownVisible}>
            <ArrowRightIcon />
          </StyledRightIcon>
        )}
      </StyledOrderItem>
      {(isDropdownVisible && isWithFiles && orderItem.fileKeys.length > 1) && (
        <Dropdown>
          {orderItem.fileKeys.map((el, i) => {
            const isSelected = selectedLinks.findIndex((link) => link === i) >= 0;
            return (
              <DropdownItem
                key={el.s3Key}
                isSelected={isSelected}
                isPreview={i === linkPreview}
                onClick={() => onItemClick(i, false)}
              >
                <Checkbox
                  type="checkbox"
                  checked={isSelected}
                  onChange={({ target }) => {
                    checkboxClickHandler(target.checked, orderItem.orderId, i);
                  }}
                />
                <span>{el.filename || el.s3Key}</span>
              </DropdownItem>
            );
          })}
        </Dropdown>
      )}
    </>
  );
};

const StyledOrderItem = styled.div<{ isSelected: boolean, isPreview: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
  padding: 14px 32px;
  cursor: pointer;
  
  ${({ isPreview, isSelected }) => {
    if (isSelected && isPreview) return 'background-color: rgba(39, 163, 118, 0.2);';
    if (isSelected) return 'background-color: var(--primary-green-background-color);';
    if (isPreview) return 'background-color: rgba(0, 0, 0, .05);';

    return '';
  }}
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const OrderItemTitle = styled.p`
  margin-bottom: 4px;
  max-width: 200px;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const OrderItemInfo = styled.p`
  max-width: 200px;
  font-size: 14px;
  font-weight: 500;
  color: #6c7278;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledRightIcon = styled.div<{ isSelected: boolean }>`
  transition: .2s ease-in-out;
  transform: rotate(${({ isSelected }) => (isSelected ? '90deg' : '0deg')});
`;

const Dropdown = styled.div`
  box-shadow: inset 0 21px 28px -17px rgba(0, 0, 0, .06), inset 0 -21px 28px -17px rgba(0, 0, 0, .05);
`;

const DropdownItem = styled.div<{ isSelected: boolean, isPreview: boolean }>`
  display: flex;
  align-items: center;
  grid-gap: 16px;
  padding: 10px 32px;
  font-size: 14px;
  user-select: none;
  cursor: pointer;

  ${({ isPreview, isSelected }) => {
    if (isSelected && isPreview) return 'background-color: rgba(39, 163, 118, 0.2);';
    if (isSelected) return 'background-color: var(--primary-green-background-color);';
    if (isPreview) return 'background-color: rgba(0, 0, 0, .05);';

    return '';
  }}
  
  span {
    max-width: 330px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export default OrderItem;
