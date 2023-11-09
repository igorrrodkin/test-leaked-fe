import React from 'react';

import AddressInputs from '@/components/AddOrder/VIC/AddressInputs';
import LotPlanOrListInputs from '@/components/AddOrder/VIC/LotPlanOrListInputs';
import VolumeFolioInputs from '@/components/AddOrder/VIC/VolumeFolioInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'VIC')!;

interface Props {
  selectedService: number
}

const VicInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Volume/Folio': return <VolumeFolioInputs />;
      case 'Address': return <AddressInputs />;
      case 'Lot/Plan or List': return <LotPlanOrListInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default VicInputs;
