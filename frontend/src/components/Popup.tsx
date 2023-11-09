import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';
import ErrorIcon from '@/assets/icons/ErrorIcon';
import InfoPopupIcon from '@/assets/icons/InfoPopupIcon';
import SuccessIcon from '@/assets/icons/SuccessIcon';

import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

interface Props {
  type: PopupTypes;
  mainText: string;
  additionalText: string;
  applyTimeout?: boolean;
}

const hidePopupTime = 7000;

const Popup: React.FC<Props> = ({
  type,
  mainText,
  additionalText,
  applyTimeout = true,
}) => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (applyTimeout) {
      const timer = setTimeout(() => {
        dispatch(userActions.setPopup(null));
      }, hidePopupTime);

      return () => clearTimeout(timer);
    }
  }, []);

  const getIcon = () => {
    switch (type) {
      case PopupTypes.SUCCESS:
        return <StyledSuccessIcon />;
      case PopupTypes.ERROR:
        return <StyledErrorIcon />;
      case PopupTypes.INFO:
        return <StyledInfoIcon />;
      default:
        return <StyledSuccessIcon />;
    }
  };

  return (
    <Div type={type} onClick={(evt) => evt.stopPropagation()}>
      {getIcon()}
      <TextContent>
        <Header>
          <MainText>{mainText}</MainText>
          <CloseIcon onClick={() => dispatch(userActions.setPopup(null))} />
        </Header>
        <AdditionalText>{additionalText}</AdditionalText>
      </TextContent>
    </Div>
  );
};

const Div = styled.div<{ type: PopupTypes }>`
  position: fixed;
  top: calc(var(--search-height) + 16px);
  right: 16px;
  display: flex;
  align-items: center;
  grid-gap: 18px;
  padding: 12px 12px 12px 18px;
  width: 100%;
  max-width: 330px;
  border-radius: 4px;
  z-index: 10000;

  ${({ type }) => {
    if (type === PopupTypes.SUCCESS) {
      return css`
        border-left: 3px solid var(--primary-green-color);
        background-color: #ecf8f0;

        * {
          color: var(--primary-green-color);
        }
      `;
    }
    if (type === PopupTypes.ERROR) {
      return css`
        border-left: 3px solid var(--primary-red-color);
        background-color: #f8ecec;

        * {
          color: var(--primary-red-color);
        }
      `;
    }
    if (type === PopupTypes.INFO) {
      return css`
        border-left: 3px solid #1138b5;
        background-color: #eceff8;

        * {
          color: #1138b5;
        }
      `;
    }
  }}
`;

const TextContent = styled.div`
  width: 100%;
`;

const StyledSuccessIcon = styled(SuccessIcon)`
  min-width: 28px;
  min-height: 28px;
`;

const StyledErrorIcon = styled(ErrorIcon)`
  min-width: 28px;
  min-height: 28px;
`;

const StyledInfoIcon = styled(InfoPopupIcon)`
  min-width: 28px;
  min-height: 28px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
  width: 100%;

  svg {
    min-width: 18px;
    min-height: 18px;
    max-width: 18px;
    max-height: 18px;
    cursor: pointer;

    * {
      stroke: rgba(0, 0, 0, 0.54);
    }
  }
`;

const MainText = styled.p`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
`;

const AdditionalText = styled.p`
  padding-right: 34px;
  font-size: 12px;
`;

export default Popup;
