import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';

import Infotip from '@/components/Infotip';
import {
  Additional,
  ErrorMessage,
  Label,
  LabelText,
  Required,
} from '@/components/Input';

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelMarginBottom?: number;
  labelFontSize?: string;
  labelColor?: string;
  labelFontWidth?: string;
  inputHeight?: string;
  inputMarginBottom?: string;
  inputPadding?: string;
  inputFontSize?: string;
  isError?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  shouldBeFocused?: boolean;
  infotip?: string;
}

const Input: React.FC<Props> = ({
  label,
  labelMarginBottom = 16,
  labelFontSize = '16px',
  labelColor = '#6C7278',
  labelFontWidth = '500',
  inputHeight = '38px',
  inputMarginBottom = '13px',
  inputPadding = '13px 16px',
  inputFontSize = '12px',
  isError,
  isRequired = false,
  errorMessage,
  shouldBeFocused = false,
  infotip,
  ...props
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (shouldBeFocused && inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  }, [shouldBeFocused]);

  return (
    <Label onClick={(evt) => evt.stopPropagation()}>
      {!!label && (
        <LabelText
          fontSize={labelFontSize}
          color={labelColor}
          fontWidth={labelFontWidth}
          marginBottom={labelMarginBottom}
          isError={isError && !props.disabled}
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
      )}
      <InputWrapper marginBottom={inputMarginBottom}>
        <StyledInput
          ref={inputRef}
          isError={isError && !props.disabled}
          padding={inputPadding}
          iHeight={inputHeight}
          fontSize={inputFontSize}
          {...props}
        />
      </InputWrapper>
      {isError && !props.disabled && errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
    </Label>
  );
};

const InputWrapper = styled.div<{ marginBottom: string }>`
  position: relative;
  margin-bottom: ${({ marginBottom }) => marginBottom};

  svg {
    position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const StyledInput = styled.textarea<{
  iHeight: string;
  padding: string;
  fontSize: string;
  isError?: boolean;
}>`
  padding: ${({ padding }) => padding};
  width: 100%;
  height: ${({ iHeight }) => iHeight};
  border: 1px solid
    ${({ isError }) => (isError ? '#ff3333' : 'rgba(35, 35, 35, 0.16)')};
  border-radius: 4px;
  font-size: ${({ fontSize }) => fontSize};
  background-color: #fff;

  :focus {
    outline: 2px solid var(--primary-blue-color);
  }
  
  :disabled {
    background-color: rgba(0, 0, 0, .05);
  }
`;

export default Input;
