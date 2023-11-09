import React, { useRef } from 'react';
import { BsChevronDown } from 'react-icons/all';
import styled, { css } from 'styled-components';

import Infotip from '@/components/Infotip';
import {
  Additional,
  Label,
  LabelText,
  Required,
} from '@/components/Input';

import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

interface Props {
  label: string,
  labelMarginBottom?: number,
  labelFontSize?: string,
  labelColor?: string,
  labelFontWidth?: string,
  isRequired?: boolean,
  infotip?: string,
  maxWidth?: string,
  prefix?: string,
  postfix?: string,
  selectedItem?: number,
  setSelectedItem: Function,
  additionalSetData?: number,
  items: string[] | number[],
  openToTop?: boolean,
  modalRef?: HTMLDivElement,
  placeholder?: string,
  height?: string,
  fontSize?: string,
  padding?: string,
  disabled?: boolean,
  isError?: boolean,
  errorMessage?: string,
  topThreshold?: number,
  bottomThreshold?: number,
}

const SelectWithLabel: React.FC<Props> = ({
  label,
  labelMarginBottom = 16,
  labelFontSize = '16px',
  labelColor = '#6C7278',
  labelFontWidth = '500',
  isRequired = false,
  infotip,
  maxWidth = 'auto',
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
  topThreshold = 0,
  bottomThreshold = 0,
}) => {
  const [isOpenToTop, toggleIsOpenToTop] = useToggle(openToTop);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const [ref, isItemsVisible, toggleIsItemsVisible] = useOnClickOutside<HTMLDivElement>(false, modalRef);

  const toggleVisibility: HandleToggle = (value) => {
    const updatedVisibility = !(typeof value === 'boolean' ? value : isItemsVisible);

    toggleIsItemsVisible(updatedVisibility);

    if (!openToTop && labelRef.current && ref.current && updatedVisibility) {
      const rect = labelRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight - topThreshold - bottomThreshold;
      const threshold = 204;

      if (rect.top < threshold) {
        toggleIsOpenToTop(false);

        return;
      }

      if (screenHeight - rect.bottom < threshold) {
        toggleIsOpenToTop(true);

        return;
      }

      toggleIsOpenToTop(false);
    }
  };

  return (
    <Label
      ref={labelRef}
      style={{ width: maxWidth ? '100%' : 'auto', maxWidth }}
    >
      <LabelText
        fontSize={labelFontSize}
        fontWidth={labelFontWidth}
        color={labelColor}
        isError={isError}
        marginBottom={labelMarginBottom}
      >
        {label}
        {(isRequired || infotip) && (
          <Additional>
            {isRequired && (
              <Required>
                *
              </Required>
            )}
            {!!infotip && (
              <Infotip infotip={infotip} />
            )}
          </Additional>
        )}
      </LabelText>
      <Wrapper ref={ref}>
        <StyledSelect
          isPlaceholder={selectedItem === undefined}
          onClick={toggleVisibility}
          height={height}
          fontSize={fontSize}
          padding={padding}
          disabled={disabled}
          isError={isError}
        >
          {`${prefix} ${
            selectedItem !== undefined
              ? `${items[selectedItem]} ${postfix}`
              : placeholder
          }`}
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
          <Dropdown openToTop={isOpenToTop}>
            {items.map((el, i) => (
              <DropdownItem
                fontSize={fontSize}
                key={`${el}${i}`}
                isSelected={i === selectedItem}
                onClick={() => {
                  setSelectedItem(i, additionalSetData);
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
    </Label>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

interface IStyledSelect {
  isPlaceholder: boolean;
  height: string;
  fontSize: string;
  padding: string;
  isError?: boolean;
}

const StyledSelect = styled.button<IStyledSelect>`
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
    background-color: rgba(0, 0, 0, .05);
  }
  
  ${({ isError }) => isError && css`
    border-color: #ff3333;
  `}
`;

const Dropdown = styled.ul<{ openToTop: boolean }>`
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

const DropdownItem = styled.li<{ isSelected: boolean; fontSize: string }>`
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

const ErrorMessage = styled.div`
  margin-top: 6px;
  height: 14px;
  color: var(--primary-red-color);
  font-size: 12px;
  font-weight: 400;
`;

export default SelectWithLabel;
