import React from 'react';
import styled, { css } from 'styled-components';

interface Props<T> {
  value: T;
  onClick: (value: T) => void;
  isActive: boolean;
}

const Tab = <T extends string>({ value, onClick, isActive }: Props<T>) => {
  const handleOnCLick = () => {
    onClick(value);
  };

  return <TabStyled onClick={handleOnCLick} isActive={isActive}>{value}</TabStyled>;
};

const TabStyled = styled.div<{ isActive: boolean }>`
  padding: 16px 20px;

  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.03em;
  color: #6C7278;
  flex: none;
  order: 0;
  flex-grow: 0;
  white-space: nowrap;
  margin-bottom: -1px;
  text-transform: capitalize;
  cursor: pointer;

  ${({ isActive }) => isActive && css`
    color: #27A376;
    font-weight: 600;
    border-bottom: 2px solid #27A376;
  `}
`;

export default Tab;
