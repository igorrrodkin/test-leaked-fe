import React, { useRef } from 'react';
import { BsChevronDown } from 'react-icons/all';
import styled from 'styled-components';

import Infotip from '@/components/Infotip';
import {
  Additional,
  ErrorMessage,
  Label,
  LabelText,
  Required,
} from '@/components/Input';
import {
  Dropdown,
  DropdownItem,
  StyledSelect,
  Wrapper,
} from '@/components/Select';

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
  marginBottom?: string,
  selectedItem?: string,
  setSelectedItem: Function,
  dividers: string[],
  items: string[],
  openToTop?: boolean,
  placeholder?: string,
  height?: string,
  fontSize?: string,
  padding?: string,
  isError?: boolean,
  errorMessage?: string,
  topThreshold?: number,
  bottomThreshold?: number,
}

const SelectParishTownship: React.FC<Props> = ({
  label,
  labelMarginBottom = 16,
  labelFontSize = '16px',
  labelColor = '#6C7278',
  labelFontWidth = '500',
  isRequired = false,
  infotip,
  maxWidth = 'auto',
  marginBottom = '0',
  selectedItem,
  setSelectedItem,
  dividers,
  items,
  openToTop = false,
  placeholder = '',
  height = '38px',
  fontSize = '12px',
  padding = '13px 16px',
  isError,
  errorMessage,
  topThreshold = 0,
  bottomThreshold = 0,
}) => {
  const [isOpenToTop, toggleIsOpenToTop] = useToggle(openToTop);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const [ref, isItemsVisible, toggleIsItemsVisible] = useOnClickOutside<HTMLDivElement>(false);

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
      style={{ width: '100%', marginBottom, maxWidth }}
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
          isError={isError}
        >
          {selectedItem !== undefined
            ? `${selectedItem}`
            : placeholder}
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
            {items.map((el, i) => {
              if (dividers.includes(el)) {
                return (
                  <Divider
                    key={`${el}${i}`}
                  >
                    {el}
                  </Divider>
                );
              }

              return (
                <DropdownItem
                  key={`${el}${i}`}
                  fontSize={fontSize}
                  isSelected={el === selectedItem}
                  onClick={() => {
                    setSelectedItem(el);
                  }}
                >
                  {el}
                </DropdownItem>
              );
            })}
          </Dropdown>
        ) : (
          ''
        )}
      </Wrapper>
    </Label>
  );
};

const Divider = styled.li`
  padding: 4px 12px;
  font-size: 16px;
  color: #6C7278;
  font-weight: 600;
`;

export default SelectParishTownship;
