import React from 'react';
import styled from 'styled-components';

import CrossErrorIcon from '@/assets/icons/CrossErrorIcon';
import SuccessIcon from '@/assets/icons/SuccessIcon';

export interface IUsernameValidation {
  minFiveCharacters: boolean;
  maxFiftyCharacters: boolean;
  onlyAcceptedSymbols: boolean;
}

interface Props {
  validationConfig: IUsernameValidation;
  isPrevInfo?: boolean;
}

const UsernameValidation: React.FC<Props> = ({
  validationConfig,
  isPrevInfo = false,
}) => (
  <List>
    <ListItem
      isValid={validationConfig.minFiveCharacters}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.minFiveCharacters ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      At least 5 characters
    </ListItem>
    <ListItem
      isValid={validationConfig.maxFiftyCharacters}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.maxFiftyCharacters ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      Less than 50 characters
    </ListItem>
    <ListItem
      isValid={validationConfig.onlyAcceptedSymbols}
      isPrevInfo={isPrevInfo}
    >
      {validationConfig.onlyAcceptedSymbols ? (
        <SuccessIcon />
      ) : (
        <CrossErrorIcon />
      )}
      Contain only accepted symbols
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
    stroke: ${({ isPrevInfo, isValid }) => isPrevInfo && !isValid && '#6C7278'};
  }
`;

export default UsernameValidation;
