import React from 'react';
import { BsChevronDown } from 'react-icons/all';
import styled, { css } from 'styled-components';

import { ErrorMessage } from '@/components/Input';

import useOnClickOutside from '@/hooks/useOnClickOutside';

interface Props {
  prefix?: string;
  postfix?: string;
  selectedItem?: number;
  setSelectedItem: Function;
  additionalSetData?: number;
  items: string[] | number[];
  openToTop?: boolean;
  modalRef?: HTMLDivElement;
  placeholder?: string;
  height?: string;
  fontSize?: string;
  padding?: string;
  disabled?: boolean;
  isError?: boolean,
  errorMessage?: string,
  textOverflow?: boolean;
  useToggle?: boolean;
}

const Select: React.FC<Props> = ({
  prefix = '',
  postfix = '',
  selectedItem,
  setSelectedItem,
  additionalSetData,
  items,
  openToTop = false,
  modalRef,
  placeholder = '',
  height = '38px',
  fontSize = '12px',
  padding = '13px 16px',
  disabled,
  isError,
  errorMessage,
  textOverflow,
  useToggle,
}) => {
  const [ref, isItemsVisible, toggleIsItemsVisible] = useOnClickOutside<HTMLDivElement>(false, modalRef);

  return (
    <Wrapper ref={ref}>
      <StyledSelect
        type="button"
        isPlaceholder={selectedItem === undefined}
        onClick={toggleIsItemsVisible}
        height={height}
        fontSize={fontSize}
        padding={padding}
        disabled={disabled}
        isError={isError}
      >
        <span className={`${textOverflow ? 'text-overflow' : ''}`}>
          {`${prefix} ${
            selectedItem !== undefined
              ? `${items[selectedItem]} ${postfix}`
              : placeholder
          }`}
        </span>
        <BsChevronDown
          style={{ transform: isItemsVisible ? 'rotate(180deg)' : '' }}
        />
      </StyledSelect>
      {isError && errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
      {isItemsVisible && items.length > 0 ? (
        <Dropdown openToTop={openToTop}>
          {items.map((el, i) => (
            <DropdownItem
              fontSize={fontSize}
              key={`${el}${i}`}
              isSelected={i === selectedItem}
              onClick={() => {
                setSelectedItem(i, additionalSetData);
                if (useToggle) {
                  toggleIsItemsVisible(false);
                }
              }}
            >
              {`${prefix} ${el} ${postfix}`}
            </DropdownItem>
          ))}
        </Dropdown>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  position: relative;
`;

interface IStyledSelect {
  isPlaceholder: boolean;
  height: string;
  fontSize: string;
  padding: string;
  isError?: boolean;
}

export const StyledSelect = styled.button<IStyledSelect>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ padding }) => padding};
  width: 100%;
  min-width: 55px;
  column-gap: 14px;
  height: ${({ height }) => height};
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 4px;
  font-size: ${({ fontSize }) => fontSize};
  text-align: left;
  background-color: #fff;

  ${({ isPlaceholder }) => isPlaceholder
    && css`
      color: rgba(117, 117, 117, 0.7) !important;
    `}

  svg {
    margin-left: auto;
    transition: 0.2s ease-in-out;
  }

  :disabled {
    cursor: initial;
  }
  
  ${({ isError }) => isError && css`
    border-color: #ff3333;
  `}
`;

export const Dropdown = styled.ul<{ openToTop: boolean }>`
  position: absolute;
  right: 0;
  left: 0;
  padding: 0.5rem 0;
  max-height: 200px;
  border: 1px solid rgba(156, 163, 175, 0.6);
  border-radius: 5px;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 100;

  ${({ openToTop }) => (openToTop
    ? css`
          bottom: calc(100% + 4px);
        `
    : css`
          top: calc(100% + 4px);
        `)}
`;

export const DropdownItem = styled.li<{ isSelected: boolean; fontSize: string }>`
  padding: 4px 12px;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: 400;
  color: ${({ isSelected }) => (isSelected ? 'var(--primary-green-color)' : 'inherit')};
  cursor: pointer;
  transition: .1s ease-in-out;

  :hover {
    color: var(--primary-green-hover-color);
  }
`;

export default Select;
