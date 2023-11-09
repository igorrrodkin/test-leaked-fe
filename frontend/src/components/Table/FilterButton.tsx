import React, { forwardRef, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import CalendarIcon from '@/assets/icons/CalendarIcon';

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: string,
  isDropdownVisible: boolean,
  isError?: boolean,
  isApplied?: boolean,
  isCalendar?: boolean
}

const FilterButton = forwardRef<HTMLDivElement, Props>(({
  children, isCalendar = false, onClick, ...props
}, ref) => (
  <Div
    ref={ref}
    isCalendar={isCalendar}
    onClick={(event) => {
      if (event.target.name === 'dropdownInput') {
        event.stopPropagation();
      } else if (onClick) {
        onClick(event);
      }
    }}
    {...props}
  >
    <Wrap>{props.value}</Wrap>
    {children}
    {isCalendar ? (
      <CalendarIcon />
    ) : (
      <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.96012 0.0900269H3.84512H1.04012C0.560118 0.0900269 0.320118 0.670027 0.660118 1.01003L3.25012 3.60003C3.66512 4.01503 4.34012 4.01503 4.75512 3.60003L5.74012 2.61503L7.34512 1.01003C7.68012 0.670027 7.44012 0.0900269 6.96012 0.0900269Z" fill="#292D32" />
      </svg>
    )}
  </Div>
));

const Wrap = styled.div`
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
`;

const Div = styled.div<{
  isDropdownVisible?: boolean,
  isApplied?: boolean,
  isCalendar: boolean,
  isError?: boolean,
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 6px;
  padding: 0 19px;
  height: 38px;
  border: 1px solid ${({ isError }) => (isError ? 'var(--primary-red-color)' : 'rgba(35, 35, 35, 0.16)')};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
  background-color: ${({ isApplied }) => (isApplied ? 'var(--primary-green-background-color)' : '#fff')};
  cursor: pointer;
  
  :hover {
    border: 1px solid ${({ isError }) => (isError ? 'var(--primary-red-hover-color)' : 'var(--primary-dark-hover-color)')};
  }
  
  ${({ isCalendar, isDropdownVisible }) => (isCalendar ? css`
    justify-content: flex-start;
    height: 48px;
    font-size: 16px;
    font-weight: 400;
    color: #6C7278;
    
    & > svg {
      position: absolute;
      top: 50%;
      right: 16px;
      width: 18px;
      height: 18px;
      transform: translateY(-50%);
    }
  ` : css`
    & > svg {
      width: 8px;
      height: 4px;
      transition: .1s ease-in-out;
      ${isDropdownVisible ? 'transform: rotate(180deg)' : ''}
    }
  `)}
  
  ${({ isDropdownVisible }) => (isDropdownVisible ? css`
    ::after {
      content: "";
      position: absolute;
      top: calc(100% + 7px);
      left: 50%;
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 12px 24px 12px;
      border-color: transparent transparent #fff transparent;
      transform: translateX(-50%);
      z-index: 5;
    }
  ` : '')}
`;

export default FilterButton;
