import React from 'react';
import styled from 'styled-components';

import Input, { Label, LabelText } from '@/components/Input';
import SelectWithLabel from '@/components/SelectWithLabel';

import { OnChange } from '@/hooks/useInput';

interface Props {
  isEditMode: boolean;
  value: string;
  isLocked?: boolean;
  label?: string;
  labelMarginBottom?: number;
  labelFontWeight?: number;
  placeholder?: string;
  padding?: string;
  fontSize?: string;
  setValue?: OnChange;
  selector?: {
    value: number;
    values: string[];
    setValue: Function;
  };
  isError?: boolean;
  maxLength?: number;
}

const EditableInput: React.FC<Props> = ({
  isEditMode,
  isLocked = false,
  label,
  labelMarginBottom = 12,
  padding = '0 24px',
  fontSize = '16px',
  value = '',
  setValue,
  placeholder,
  selector,
  isError = false,
  maxLength,
}) => {
  const getContent = () => {
    if (isEditMode) {
      if (isLocked) {
        return (
          <div className="locked">
            <LabelText
              fontSize="16px"
              fontWidth="500"
              marginBottom={labelMarginBottom}
              color="#6c7278"
            >
              {label}
            </LabelText>
            <Data style={{ padding, fontSize }}>
              {value}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8.33268V6.66602C5 3.90768 5.83333 1.66602 10 1.66602C14.1667 1.66602 15 3.90768 15 6.66602V8.33268"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 15.4167C11.1506 15.4167 12.0834 14.4839 12.0834 13.3333C12.0834 12.1827 11.1506 11.25 10 11.25C8.84943 11.25 7.91669 12.1827 7.91669 13.3333C7.91669 14.4839 8.84943 15.4167 10 15.4167Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1667 18.334H5.83335C2.50002 18.334 1.66669 17.5007 1.66669 14.1673V12.5007C1.66669 9.16732 2.50002 8.33398 5.83335 8.33398H14.1667C17.5 8.33398 18.3334 9.16732 18.3334 12.5007V14.1673C18.3334 17.5007 17.5 18.334 14.1667 18.334Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Data>
          </div>
        );
      }

      if (selector) {
        return (
          <SelectWithLabel
            label={label!}
            selectedItem={selector.value}
            items={selector.values}
            setSelectedItem={selector.setValue}
            labelMarginBottom={labelMarginBottom}
            height="48px"
            fontSize="16px"
            padding="16px 24px"
          />
        );
      }

      return (
        <Input
          label={label}
          labelMarginBottom={labelMarginBottom}
          inputPadding="16px 24px"
          inputHeight="48px"
          inputFontSize="16px"
          inputMarginBottom="0"
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          isError={isError}
          maxLength={maxLength}
        />
      );
    }

    return (
      <Label fontWeight="500">
        <LabelText
          marginBottom={12}
          fontSize="16px"
          fontWidth="400"
          color="#6c7278"
        >
          {label}
        </LabelText>
        <Data>{value}</Data>
      </Label>
    );
  };

  return getContent();
};

const Data = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  border: 1px solid #dce4e8;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .05);

  svg {
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
  }
`;

export default EditableInput;
