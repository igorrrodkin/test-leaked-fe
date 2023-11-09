import React from 'react';
import styled from 'styled-components';

import { IOrganisationService } from '@/store/reducers/services';

interface Props {
  service: IOrganisationService,
  onClick: (service: IOrganisationService) => void
}

const RecentServices: React.FC<Props> = ({ service, onClick }) => {
  const handleOnClick = () => {
    onClick(service);
  };

  return (
    <RecentServicesStyled onClick={handleOnClick}>
      <Text>{service.searchType}</Text>
      <Region>{service.region}</Region>
    </RecentServicesStyled>
  );
};

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

const RecentServicesStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 14px;
  cursor: pointer;
`;

export default RecentServices;
