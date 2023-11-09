import React from 'react';
import styled from 'styled-components';

import LocationIcon from '@/assets/icons/LocationIcon';

import { IAddress } from '@/components/GlobalSearch/GlobalSearch';

interface Props {
  result: IAddress,
  onClick: (result: IAddress) => void
}

const GoogleAddress: React.FC<Props> = ({ result, onClick }) => {
  const handleOnClick = () => {
    onClick(result);
  };

  return (
    <GoogleAddressStyled onClick={handleOnClick}>
      <IconWrap>
        <LocationIcon />
      </IconWrap>
      <Text>{result.address}</Text>
    </GoogleAddressStyled>
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

const GoogleAddressStyled = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  cursor: pointer;
`;

export default GoogleAddress;
