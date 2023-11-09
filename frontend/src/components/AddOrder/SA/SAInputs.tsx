import React from 'react';

import AddressInputs from '@/components/AddOrder/SA/AddressInputs';
import OwnerIndividualInputsSA from '@/components/AddOrder/SA/OwnerIndividualInputsSA';
import OwnerOrganisationInputsSA from '@/components/AddOrder/SA/OwnerOrganisationInputsSA';
import PlanParcelInputs from '@/components/AddOrder/SA/PlanParcelInputs';
import VolumeFolioInputs from '@/components/AddOrder/SA/VolumeFolioInputs';

import getRegionsData from '@/utils/getRegionsData';

const currentRegion = getRegionsData().find((el) => el.region === 'SA')!;

interface Props {
  selectedService: number
}

const VicInputs: React.FC<Props> = ({ selectedService }) => {
  const getContent = () => {
    switch (currentRegion.services[selectedService].name) {
      case 'Volume/Folio': return <VolumeFolioInputs />;
      case 'Address': return <AddressInputs />;
      case 'Plan/Parcel': return <PlanParcelInputs />;
      case 'Owner (Individual)': return <OwnerIndividualInputsSA />;
      case 'Owner (Organisation)': return <OwnerOrganisationInputsSA />;
      default: return <></>;
    }
  };
  return getContent();
};

export default VicInputs;
