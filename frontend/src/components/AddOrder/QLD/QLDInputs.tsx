import React from 'react';

import AddressInputsQLD from '@/components/AddOrder/QLD/AddressInputsQLD';
import LotPlanInputs from '@/components/AddOrder/QLD/LotPlanInputs';
import OwnerIndividualInputsQLD from '@/components/AddOrder/QLD/OwnerIndividualInputsQLD';
import OwnerOrganisationInputsQLD from '@/components/AddOrder/QLD/OwnerOrganisationInputsQLD';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'QLD')!;

interface Props {
  selectedService: number
}

const QldInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Address': return <AddressInputsQLD />;
      case 'Owner (Individual)': return <OwnerIndividualInputsQLD />;
      case 'Owner (Organisation)': return <OwnerOrganisationInputsQLD />;
      case 'Lot/Plan': return <LotPlanInputs />;
      default: return <></>;
    }
  };
  return getContent();
};

export default QldInputs;
