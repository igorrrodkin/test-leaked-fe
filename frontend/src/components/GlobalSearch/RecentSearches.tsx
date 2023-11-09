import React from 'react';
import styled from 'styled-components';

import ClockIcon from '@/assets/icons/ClockIcon';

interface Props {
  search: string,
  onClick: (search: string) => void
}

const RecentSearches: React.FC<Props> = ({ search, onClick }) => {
  const handleOnClick = () => {
    onClick(search);
  };

  return (
    <RecentSearchesStyled onClick={handleOnClick}>
      <IconWrap>
        <ClockIcon />
      </IconWrap>
      <Text>{search}</Text>
    </RecentSearchesStyled>
  );
};

const IconWrap = styled.div`
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #000000;
`;

const RecentSearchesStyled = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  cursor: pointer;
`;

export default RecentSearches;
