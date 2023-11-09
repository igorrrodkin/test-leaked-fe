import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
} from 'react';
import { IoCloseOutline } from 'react-icons/all';
import InputMask from 'react-input-mask';
import styled from 'styled-components';

import Infotip from '@/components/Infotip';

import useToggle from '@/hooks/useToggle';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
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
  clearField?: React.MouseEventHandler<SVGElement> | undefined;
  infotip?: string;
  mask?: string;
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
  clearField,
  infotip,
  mask,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasswordVisible, toggleIsPasswordVisible] = useToggle();

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
        {mask ? (
          <InputMask
            mask={mask}
            maskPlaceholder=""
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
          >
            <StyledInput
              ref={inputRef}
              isError={isError && !props.disabled}
              padding={inputPadding}
              iHeight={inputHeight}
              fontSize={inputFontSize}
              disabled={props.disabled}
              {...props}
            />
          </InputMask>
        ) : (
          <StyledInput
            ref={inputRef}
            isError={isError && !props.disabled}
            style={props.type === 'password' || clearField ? { paddingRight: '60px' } : {}}
            padding={inputPadding}
            iHeight={inputHeight}
            fontSize={inputFontSize}
            {...props}
            type={isPasswordVisible ? 'text' : props.type}
          />
        )}
        {!!clearField && (
          <ClearIcon onClick={clearField} />
        )}
        {props.type === 'password' ? (
          !isPasswordVisible ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={toggleIsPasswordVisible}
            >
              <path
                d="M9 14.125C5.53296 14.125 2.55996 12.0114 1.28995 9C2.55996 5.98856 5.53296 3.875 9 3.875C12.467 3.875 15.44 5.98857 16.7101 9C15.44 12.0114 12.467 14.125 9 14.125ZM4.75 9C4.75 11.3461 6.65386 13.25 9 13.25C11.3461 13.25 13.25 11.3461 13.25 9C13.25 6.65386 11.3461 4.75 9 4.75C6.65386 4.75 4.75 6.65386 4.75 9ZM7.25 9C7.25 8.03114 8.03114 7.25 9 7.25C9.96886 7.25 10.75 8.03114 10.75 9C10.75 9.96886 9.96886 10.75 9 10.75C8.03114 10.75 7.25 9.96886 7.25 9Z"
                fill="black"
                fillOpacity="0.54"
                stroke="#6C7278"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={toggleIsPasswordVisible}
            >
              <path
                d="M15.9526 6.88522C15.7351 6.54022 15.5026 6.21772 15.2626 5.91772C14.9851 5.56522 14.4601 5.53522 14.1451 5.85022L11.8951 8.10022C12.0601 8.59522 12.0901 9.16522 11.9401 9.75772C11.6776 10.8152 10.8226 11.6702 9.76508 11.9327C9.17258 12.0827 8.60258 12.0527 8.10758 11.8877C8.10758 11.8877 7.03508 12.9602 6.26258 13.7327C5.88758 14.1077 6.00758 14.7677 6.51008 14.9627C7.31258 15.2702 8.14508 15.4277 9.00008 15.4277C10.3351 15.4277 11.6326 15.0377 12.8176 14.3102C14.0251 13.5602 15.1126 12.4577 15.9901 11.0552C16.7026 9.92272 16.6651 8.01772 15.9526 6.88522Z"
                fill="#6C7278"
              />
              <path
                d="M10.5155 7.48498L7.48547 10.515C7.10297 10.125 6.85547 9.58498 6.85547 8.99998C6.85547 7.82248 7.81547 6.85498 9.00047 6.85498C9.58547 6.85498 10.1255 7.10248 10.5155 7.48498Z"
                fill="#6C7278"
              />
              <path
                d="M13.6875 4.31227L11.145 6.85477C10.5975 6.29977 9.84 5.96977 9 5.96977C7.32 5.96977 5.97 7.32727 5.97 8.99977C5.97 9.83977 6.3075 10.5973 6.855 11.1448L4.32 13.6873H4.3125C3.48 13.0123 2.715 12.1498 2.0625 11.1298C1.3125 9.95227 1.3125 8.03977 2.0625 6.86227C2.9325 5.49727 3.9975 4.42477 5.1825 3.68977C6.3675 2.96977 7.665 2.57227 9 2.57227C10.6725 2.57227 12.2925 3.18727 13.6875 4.31227Z"
                fill="#6C7278"
              />
              <path
                d="M11.1446 9.00006C11.1446 10.1776 10.1846 11.1451 8.99957 11.1451C8.95457 11.1451 8.91707 11.1451 8.87207 11.1301L11.1296 8.87256C11.1446 8.91756 11.1446 8.95506 11.1446 9.00006Z"
                fill="#6C7278"
              />
              <path
                d="M16.3277 1.67266C16.1027 1.44766 15.7352 1.44766 15.5102 1.67266L1.67266 15.5177C1.44766 15.7427 1.44766 16.1102 1.67266 16.3352C1.78516 16.4402 1.92766 16.5002 2.07766 16.5002C2.22766 16.5002 2.37016 16.4402 2.48266 16.3277L16.3277 2.48266C16.5602 2.25766 16.5602 1.89766 16.3277 1.67266Z"
                fill="#6C7278"
              />
            </svg>
          )
        ) : (
          ''
        )}
      </InputWrapper>
      {isError && !props.disabled && errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
    </Label>
  );
};

export const Label = styled.label<{ fontWeight?: string }>`
  display: flex;
  flex-direction: column;
  color: var(--primary-grey-color);
  font-weight: ${({ fontWeight = '600' }) => fontWeight};
`;

export const LabelText = styled.span<{
  fontSize: string;
  color: string;
  fontWidth: string;
  marginBottom: number;
  isError?: boolean;
}>`
  display: flex;
  align-items: center;
  grid-gap: 4px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWidth }) => fontWidth};
  color: ${({ color, isError }) => (isError ? 'var(--primary-red-color)' : color)};
`;

export const Additional = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 4px;
`;

export const Required = styled.span`
  color: var(--primary-red-color);
`;

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

const StyledInput = styled.input<{
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

const ClearIcon = styled(IoCloseOutline)`
  position: absolute;
  top: 50%;
  right: 16px !important;
  width: 1.25rem;
  height: 1.25rem;
  transform: translateY(-50%);
  cursor: pointer;

  :hover * {
    stroke: var(--primary-blue-color);
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 6px;
  height: 14px;
  color: var(--primary-red-color);
  font-size: 12px;
  font-weight: 400;
`;

export default Input;
