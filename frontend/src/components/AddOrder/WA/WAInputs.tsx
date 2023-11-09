import React from 'react';

import AddressInputs from '@/components/AddOrder/AddressInputs';
import OwnerOrganisationInputs from '@/components/AddOrder/OwnerOrganisationInputs';
import OwnerIndividualInputs from '@/components/AddOrder/WA/OwnerIndividualInputs';
import TitleInputs from '@/components/AddOrder/WA/TitleInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'WA')!;

interface Props {
  selectedService: number
}

const WaInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Title Reference': return <TitleInputs />;
      case 'Address': return <AddressInputs />;
      case 'Owner (Individual)': return <OwnerIndividualInputs />;
      case 'Owner (Organisation)': return <OwnerOrganisationInputs />;
      default: return <></>;
    }
  };

  return getContent();
};

export default WaInputs;
