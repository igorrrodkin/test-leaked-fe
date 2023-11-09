import React from 'react';

import AddressInputs from '@/components/AddOrder/TAS/AddressInputs';
import VolumeFolioInputs from '@/components/AddOrder/TAS/VolumeFolioInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'TAS')!;

interface Props {
  selectedService: number
}

const TasInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Volume/Folio': return <VolumeFolioInputs />;
      case 'Address': return <AddressInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default TasInputs;
