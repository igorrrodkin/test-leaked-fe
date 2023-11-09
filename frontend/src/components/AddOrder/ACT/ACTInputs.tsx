import React from 'react';

import AddressInputs from '@/components/AddOrder/TAS/AddressInputs';
import ParcelInputs from '@/components/AddOrder/TAS/ParcelInputs';
import VolumeFolioInputs from '@/components/AddOrder/TAS/VolumeFolioInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'ACT')!;

interface Props {
  selectedService: number
}

const ActInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Volume/Folio': return <VolumeFolioInputs />;
      case 'Address': return <AddressInputs />;
      case 'Parcel': return <ParcelInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default ActInputs;
