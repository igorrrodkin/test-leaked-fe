import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface Props extends PropsWithChildren {
  label: string,
  isError: string | undefined,
}

const CardInputWrapper: React.FC<Props> = ({
  label,
  isError,
  children,
}) => (
  <StyledInputWrapper isError={!!isError}>
    {label}
    <div>
      {children}
      {isError && (
      <ErrorMessage>
        {isError}
      </ErrorMessage>
      )}
    </div>
  </StyledInputWrapper>
);

const StyledInputWrapper = styled.div<{ isError: boolean }>`
  display: flex;
  flex-direction: column;
  grid-gap: 12px;
  width: 100%;
  max-width: 412px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ isError }) => (isError ? 'var(--primary-red-color)' : '#6C7278')};
  
  .StripeElement {
    width: 100%;
    max-width: 412px;
    padding: 13px 16px;
    border: 1px solid rgba(35, 35, 35, 0.16);
    border-radius: 4px;
    font-family: Inter, sans-serif;
    font-size: 12px;
    color: var(--primary-dark-color);
    cursor: text;
  }
  
  .StripeElement--invalid {
    border-color: var(--primary-red-color);
  }
`;

const ErrorMessage = styled.div`
  margin-top: 6px;
  height: 14px;
  color: var(--primary-red-color);
  font-size: 12px;
  font-weight: 400;
`;

export default CardInputWrapper;
