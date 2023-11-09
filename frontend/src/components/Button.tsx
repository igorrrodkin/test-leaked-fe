import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isCancel?: boolean;
  isRedButton?: boolean;
  isTransparent?: boolean;
  width?: string;
}

const Button: React.FC<ButtonProps> = ({
  isCancel = false,
  isRedButton = false,
  isTransparent = false,
  width,
  children,
  ...props
}) => (
  <StyledButton
    isCancel={isCancel}
    isRedButton={isRedButton}
    isTransparent={isTransparent}
    width={width}
    {...props}
  >
    {children}
  </StyledButton>
);

const StyledButton = styled.button<{
  isCancel: boolean;
  isRedButton?: boolean;
  isTransparent?: boolean;
  width?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 22px;
  height: 38px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-green-color);
  transition: .1s ease-in-out;

  :disabled {
    background-color: rgba(39, 163, 118, 0.6);
    cursor: default;
  }

  :not(:disabled):hover {
    background-color: var(--primary-green-hover-color);
  }
  
  ${({ width }) => !!width && css`
    width: ${width};
    min-width: ${width};
  `}

  ${({ isCancel, isRedButton }) => {
    if (isCancel) {
      return css`
        color: var(--primary-dark-color);
        background-color: #edf1f3;

        :disabled {
          background-color: rgba(189, 193, 195, 0.6);
          cursor: default;
        }

        :not(:disabled):hover {
          background-color: rgba(189, 193, 195, 0.6);
        }
      `;
    }
    if (isRedButton) {
      return css`
        background-color: var(--primary-red-color);

        :not(:disabled):hover {
          background-color: var(--primary-red-hover-color);
        }
      `;
    }
  }}

  ${({ isTransparent }) => isTransparent
    && css`
      color: var(--primary-green-color);
      background-color: #ffffff;
      border: 1px solid var(--primary-green-color);

      :disabled {
        background-color: #edf1f3;
        cursor: default;
      }

      :not(:disabled):hover {
        border: 1px solid rgba(39, 163, 118, 0.6);
        color: rgba(39, 163, 118, 0.6);
        background-color: #ffffff;
      }
    `}
`;

export default Button;
