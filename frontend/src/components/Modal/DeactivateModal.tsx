import React from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

import Button, { ButtonProps } from '@/components/Button';
import Loader from '@/components/Loader';

interface Props {
  title: string;
  subTitle: string;
  cancelButton: {
    onCancel: () => void;
    name: string;
    style: ButtonProps
    isLoading: boolean
  }
  confirmButton: {
    onConfirm: () => void;
    name: string;
    style: ButtonProps
    isLoading: boolean
  }
}

const DeactivateModal: React.FC<Props> = ({
  title,
  subTitle,
  cancelButton,
  confirmButton,
}) => (
  <DeactivateModalStyled>
    <Title>{title}</Title>
    <SubTitle>{parse(subTitle)}</SubTitle>
    <ButtonWrap>
      <Button
        onClick={cancelButton.onCancel}
        {...cancelButton.style}
      >
        {cancelButton.isLoading ? <Loader size={24} thickness={2} color="#fff" /> : cancelButton.name}
      </Button>
      <Button
        onClick={confirmButton.onConfirm}
        {...confirmButton.style}
      >
        {confirmButton.isLoading ? <Loader size={24} thickness={2} color="#fff" /> : confirmButton.name}
      </Button>
    </ButtonWrap>
  </DeactivateModalStyled>
);

const ButtonWrap = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 16px;
`;

const SubTitle = styled.div`

`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -0.02em;
  color: #1A1C1E;
`;

const DeactivateModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

export default DeactivateModal;
