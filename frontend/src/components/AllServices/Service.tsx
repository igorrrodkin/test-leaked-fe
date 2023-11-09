import React from 'react';
import styled, { css } from 'styled-components';

import PinIcon from '@/assets/icons/PinIcon';

import { FullfilmentType, IOrganisationService } from '@/store/reducers/services';

import { ExistingRegions } from '@/utils/getRegionsData';

interface Props {
  service: IOrganisationService,
  isPined: boolean,
  onPin: (productId: string, region: ExistingRegions, isPined: boolean) => void
  serviceOnClick: (region: ExistingRegions, productId: string, isManual: boolean) => void
}

const Service: React.FC<Props> = ({
  service, isPined, onPin, serviceOnClick,
}) => {
  const handleOnPin = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    onPin(service.productId, service.region, isPined);
  };

  const handleServiceOnClick = () => {
    serviceOnClick(
      service.region,
      service.productId,
      service.fulfilmentType === FullfilmentType.MANUAL,
    );
  };

  return (
    <ServiceStyled
      isPined={isPined}
      onClick={handleServiceOnClick}
    >
      <Text>
        {service.searchType}
      </Text>
      <IconWrap
        onClick={handleOnPin}
      >
        <PinIcon
          color={isPined ? '#ffffff' : 'transparent'}
        />
      </IconWrap>
    </ServiceStyled>
  );
};

const Text = styled.div`
  color: var(--primary-dark-color);
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: -0.03em;
  user-select: none;
  transition: .2s ease-in-out;
`;

const IconWrap = styled.div`
  display: none;
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;
  align-items: center;
  justify-content: center;

  path {
    transition: .15s ease-in-out;
  }

  :hover path {
    fill: #fff;
  }
`;

const ServiceStyled = styled.div<{ isPined: boolean }>`
  padding-left: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 16px;
  cursor: pointer;
  height: 45px;
  border-radius: 4px;
  transition: .2s ease-in-out;
  
  :hover {
    background-color: var(--primary-green-color);
    
    ${IconWrap} {
      display: flex;
    }
    
    ${Text} {
      color: #fff;
    }
  }

  ${({ isPined }) => isPined && css`
    background-color: var(--primary-green-color);
    
    
    :hover {
      background-color: var(--primary-green-hover-color);
    }

    ${Text} {
      color: #FFFFFF;
    }
    
    ${IconWrap} {
      display: flex;

      :hover path {
        fill: transparent;
      }
    }
  `}
`;

export default Service;
