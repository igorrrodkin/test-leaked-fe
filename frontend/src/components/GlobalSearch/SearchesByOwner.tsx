import React from 'react';
import styled from 'styled-components';

import OwnerIcon from '@/assets/icons/OwnerIcon';

import { ExistingRegions } from '@/utils/getRegionsData';

interface Props {
  owner: string,
  region: ExistingRegions
  onClick: (owner: string, region: ExistingRegions) => void
}

const SearchesByOwner: React.FC<Props> = ({ owner, onClick, region }) => {
  const handleOnClick = () => {
    onClick(owner, region);
  };

  return (
    <SearchesByOwnerStyled onClick={handleOnClick}>
      <Wrap>
        <IconWrap>
          <OwnerIcon />
        </IconWrap>
        <Text>{owner}</Text>
      </Wrap>
      <Region>{region}</Region>
    </SearchesByOwnerStyled>
  );
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
`;

const IconWrap = styled.div`
  min-width: 16px;
  min-height: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Region = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #1A1C1E;
  background: #DCE4E8;
  border-radius: 2px;
  padding: 2px 6px;
`;

const Text = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #000000;
`;

const SearchesByOwnerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 14px;
  cursor: pointer;
`;

export default SearchesByOwner;
