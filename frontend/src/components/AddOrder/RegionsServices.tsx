import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ActInputs from '@/components/AddOrder/ACT/ACTInputs';
import ALLInputs from '@/components/AddOrder/ALL/ALLInputs';
import NswInputs from '@/components/AddOrder/NSW/NSWInputs';
import NtInputs from '@/components/AddOrder/NT/NTInputs';
import EmptyServices from '@/components/AddOrder/Page/EmptyServices';
import QldInputs from '@/components/AddOrder/QLD/QLDInputs';
import SAInputs from '@/components/AddOrder/SA/SAInputs';
import TASInputs from '@/components/AddOrder/TAS/TASInputs';
import VicInputs from '@/components/AddOrder/VIC/VICInputs';
import WaInputs from '@/components/AddOrder/WA/WAInputs';
import { ErrorMessage } from '@/components/Input';

import { selectCurrentService, selectSearchError, selectServices } from '@/store/selectors/orderSelectors';

import getRegionsData, { existingRegions } from '@/utils/getRegionsData';

export interface Input {
  name?: string,
  example?: string,
  items?: string[],
  isRequired?: boolean
}

export interface Service {
  name: string,
  productId: string,
  identifier: string,
  infotip?: string,
}

interface Props {
  regionName: existingRegions,
  selectedService: number
}

const RegionsServices: React.FC<Props> = ({ regionName, selectedService }) => {
  const searchError = useSelector(selectSearchError);
  const currentService = useSelector(selectCurrentService);
  const services = useSelector(selectServices);

  const getContent = useCallback(() => {
    const currentRegion = getRegionsData().find((el) => el.region === currentService?.region)!;

    if (currentRegion) {
      const currentServiceConfig = currentRegion.services[selectedService];

      if (currentServiceConfig && !services?.find((el) => el.productId === currentServiceConfig.productId)) {
        return <EmptyServices />;
      }
    } else {
      return <EmptyServices />;
    }

    switch (regionName) {
      case 'ALL': return <ALLInputs selectedService={selectedService} />;
      case 'WA': return <WaInputs selectedService={selectedService} />;
      case 'QLD': return <QldInputs selectedService={selectedService} />;
      case 'NSW': return <NswInputs selectedService={selectedService} />;
      case 'SA': return <SAInputs selectedService={selectedService} />;
      case 'TAS': return <TASInputs selectedService={selectedService} />;
      case 'NT': return <NtInputs selectedService={selectedService} />;
      case 'VIC': return <VicInputs selectedService={selectedService} />;
      case 'ACT': return <ActInputs selectedService={selectedService} />;
      default: return <></>;
    }
  }, [currentService, services]);

  return (
    <>
      {getContent()}
      {searchError && (
        <StyledErrorMessage>
          {searchError}
        </StyledErrorMessage>
      )}
    </>
  );
};

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: 12px;
  font-size: 14px;
`;

export default RegionsServices;
