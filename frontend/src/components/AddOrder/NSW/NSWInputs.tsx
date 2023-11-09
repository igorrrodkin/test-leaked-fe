import React from 'react';

import AddressInputs from '@/components/AddOrder/AddressInputs';
import TitleInputs from '@/components/AddOrder/WA/TitleInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'NSW')!;

interface Props {
  selectedService: number
}

const NswInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Title Reference': return <TitleInputs />;
      case 'Address': return <AddressInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default NswInputs;
