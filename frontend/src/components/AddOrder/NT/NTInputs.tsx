import React from 'react';

import LotTownInputs from '@/components/AddOrder/NT/LotTownInputs';
import AddressInputs from '@/components/AddOrder/TAS/AddressInputs';
import VolumeFolioInputs from '@/components/AddOrder/TAS/VolumeFolioInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'NT')!;

interface Props {
  selectedService: number
}

const NtInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Volume/Folio': return <VolumeFolioInputs />;
      case 'Lot/Town': return <LotTownInputs />;
      case 'Property Address': return <AddressInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default NtInputs;
