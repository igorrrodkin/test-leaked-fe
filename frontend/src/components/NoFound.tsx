import React from 'react';
import styled from 'styled-components';

import NoFoundIcon from '@/assets/icons/NoFoundIcon';

interface Props {
  isTextVisible?: boolean
}

const NoFound: React.FC<Props> = ({ isTextVisible = true }) => (
  <Wrap>
    <NoFoundIcon />
    <Text>No Results Found!</Text>
    {isTextVisible && (
      <SubText>
        {'try adjusting search or filter to find what you\'re looking for'}
      </SubText>
    )}
  </Wrap>
);

const Wrap = styled.div`
  padding: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const Text = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #1a1c1e;
  margin: 24px 0 16px;
`;

const SubText = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #6c7278;
`;

export default NoFound;
