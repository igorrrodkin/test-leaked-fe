import React from 'react';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import useClickOutside from '@/hooks/useClickOutside';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';

interface Props {
  closeModal: () => void,
  children: React.ReactNode,
  isFullHeight?: boolean,
  isCloseIcon?: boolean,
  overflow?: string,
}

const Modal: React.FC<Props> = ({
  closeModal,
  children,
  isFullHeight = false,
  isCloseIcon,
  overflow,
}) => {
  const escPress = useKeyPress('Esc');
  const escapePress = useKeyPress('Escape');
  const modalRef = useClickOutside(closeModal);

  useModalWindow(overflow);

  React.useEffect(() => {
    if (escPress || escapePress) {
      closeModal();
    }
  }, [escPress, escapePress]);

  return (
    <ModalStyled>
      <ModalContent ref={modalRef} isFullHeight={isFullHeight}>
        {isCloseIcon && (
        <IconWrap onClick={closeModal}>
          <CloseIcon />
        </IconWrap>
        )}
        {children}
      </ModalContent>
    </ModalStyled>
  );
};

const IconWrap = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
`;

const ModalStyled = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgba(33, 33, 33, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 60px 100px;
`;

const ModalContent = styled.div<{ isFullHeight: boolean }>`
  box-shadow: inset 0 -1px 0 0 #F3F4F5;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  position: relative;
  overflow: auto;
  height: ${({ isFullHeight }) => isFullHeight && '100%'};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
`;

export default Modal;
