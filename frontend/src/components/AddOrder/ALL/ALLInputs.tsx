import React from 'react';

import OwnerIndividualInputs from '@/components/AddOrder/ALL/OwnerIndividualInputs';
import OwnerOrganisationInputs from '@/components/AddOrder/ALL/OwnerOrganisationInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'ALL')!;

interface Props {
  selectedService: number
}

const ALLInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Owner (Individual)': return <OwnerIndividualInputs />;
      case 'Owner (Organisation)': return <OwnerOrganisationInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default ALLInputs;
