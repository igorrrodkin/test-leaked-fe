import React from 'react';
import styled from 'styled-components';

import CrossErrorIcon from '@/assets/icons/CrossErrorIcon';
import SuccessIcon from '@/assets/icons/SuccessIcon';

export interface IPasswordValidation {
  eightCharacters: boolean;
  upperCaseLetter: boolean;
  lowerCaseLetter: boolean;
  oneDigit: boolean;
}

interface Props {
  validationConfig: IPasswordValidation;
  isPrevInfo?: boolean;
}

const PasswordValidation: React.FC<Props> = ({
  validationConfig,
  isPrevInfo = false,
}) => (
  <List>
    <ListItem
      isValid={validationConfig.eightCharacters}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.eightCharacters ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      At least 8 characters
    </ListItem>
    <ListItem isValid={validationConfig.oneDigit} isPrevInfo={isPrevInfo}>
      {validationConfig.oneDigit ? <SuccessIcon /> : <CrossErrorIcon />}
      At least a number (0-9)
    </ListItem>
    <ListItem
      isValid={validationConfig.upperCaseLetter}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.upperCaseLetter ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      At least an uppercase letter (A-Z)
    </ListItem>
    <ListItem
      isValid={validationConfig.lowerCaseLetter}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.lowerCaseLetter ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      At least a lowercase letter (a-z)
    </ListItem>
  </List>
);

const List = styled.ul`
  display: flex;
  flex-direction: column;
  grid-gap: 14px;
  margin-bottom: 32px;
`;

const ListItem = styled.li<{ isValid: boolean; isPrevInfo: boolean }>`
  display: flex;
  align-items: center;
  grid-gap: 13px;
  color: ${({ isValid, isPrevInfo }) => (isPrevInfo
    ? '#6C7278'
    : isValid
      ? 'var(--primary-green-color)'
      : 'var(--primary-red-color)')};
  font-weight: 500;

  & > svg path {
    stroke: ${({ isPrevInfo }) => isPrevInfo && '#6C7278'};
  }
`;

export default PasswordValidation;
