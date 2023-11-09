import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CopyIcon from '@/assets/icons/CopyIcon';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal/Modal';

import { apiKeyActions, generateApiKeyAction } from '@/store/actions/apiKeyActions';
import { userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import { selectApiKey } from '@/store/selectors/apiKeySelectors';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

interface Props {
  organisationId: number,
  close: () => void,
}

const GenerateApiKey: React.FC<Props> = ({ organisationId, close }) => {
  const [isLoading, toggleIsLoading] = useToggle(true);

  const apiKey = useSelector(selectApiKey);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    generateKey();

    return () => {
      dispatch(apiKeyActions.setApiKey(null));
    };
  }, []);

  const generateKey = async () => {
    try {
      await dispatch(generateApiKeyAction(organisationId));
      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
      close();
    }
  };

  const copy = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      dispatch(userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Copied',
        additionalText: 'API Key was copied to clipboard',
      }));
    }
  };

  return (
    <Modal closeModal={close} isCloseIcon>
      {!isLoading ? (
        <Wrap>
          <Title>API Key generated</Title>
          <p>
            Please save this secret key somewhere safe and accessible. For security reasons,
            <span style={{ fontWeight: '700' }}> you won&apos;t be able to view it again </span>
            through your account. If you lose this secret key, you&apos;ll need to generate a new one.
          </p>
          <Key>
            <span>
              {apiKey}
            </span>
            <Copy onClick={copy}>
              <CopyIcon />
            </Copy>
          </Key>
          <StyledButton
            onClick={close}
            isCancel
          >
            OK
          </StyledButton>
        </Wrap>
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -0.02em;
  color: #1A1C1E;
`;

const Key = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 48px;
  border: 1px solid rgba(35, 35, 35, 0.16);
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  
  span {
    padding-right: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Copy = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: var(--primary-green-color);
  transition: .1s ease-in-out;
  cursor: pointer;
  
  :hover {
    background-color: var(--primary-green-hover-color);
  }
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
  width: min-content;
`;

export default GenerateApiKey;
