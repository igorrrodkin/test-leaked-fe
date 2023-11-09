/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import styled from 'styled-components';

import Loader from '@/components/Loader';

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingContainer: React.FC<Props> = ({ isLoading, children }) => (
  isLoading ? (
    <LoadingWrap>
      <Loader />
    </LoadingWrap>
  ) : (<>{children}</>)
);

const LoadingWrap = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LoadingContainer;
