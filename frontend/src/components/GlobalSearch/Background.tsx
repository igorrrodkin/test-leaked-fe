import React from 'react';
import styled from 'styled-components';

import useModalWindow from '@/hooks/useModalWindow';

interface Props {
  onClick: () => void
}

const Background: React.FC<Props> = ({ onClick }) => {
  useModalWindow();

  return <BackGround onClick={onClick} />;
};

const BackGround = styled.div`
  position: fixed;
  width: 100vw;
  height: calc(100vh - var(--search-height));
  left: 0;
  top: var(--search-height);
  background: #1a1c1e7f;
  z-index: 1000;
  cursor: pointer;
`;

export default Background;
