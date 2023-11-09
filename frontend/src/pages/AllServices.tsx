import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import GroupedService from '@/components/AllServices/GroupedService';
import Regions from '@/components/AllServices/Regions';
import Footer from '@/components/Footer';

import { orderActions } from '@/store/actions/orderActions';
import { servicesActions } from '@/store/actions/servicesActions';
import { setUsersAction } from '@/store/actions/usersActions';

import { selectIsOrderStarted, selectOrderProducts, selectSelectedRegion } from '@/store/selectors/orderSelectors';
import {
  selectOrganisationServices,
  selectPinedServices,
} from '@/store/selectors/servicesSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import useModalWindow from '@/hooks/useModalWindow';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';
import { groupBy } from '@/utils/groupBy';
import LocalStorage from '@/utils/localStorage';

import { AppDispatch } from '@/store';

export type IPinedServices = {
  [region in ExistingRegions]: string[];
};

const mockedData = getRegionsData();

const AllServices: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const services = useSelector(selectOrganisationServices);
  const pinnedServices = useSelector(selectPinedServices) || ({} as IPinedServices);
  const user = useSelector(selectUser);
  const currentRegion = useSelector(selectSelectedRegion);
  const isOrderStarted = useSelector(selectIsOrderStarted);
  const orderProducts = useSelector(selectOrderProducts);

  const [selectedRegion, setSelectedRegion] = useState(ExistingRegions.ALL);

  useModalWindow();

  const setAllPinedServices = (pinned: IPinedServices) => {
    LocalStorage.setPinedServices(pinned);
    dispatch(servicesActions.setPinedServices(pinned));
    dispatch(
      setUsersAction(user!.id, {
        pinnedServices: pinned,
        ...user!.userSettings,
      }),
    );
  };

  const groupedServicesByRegion = useMemo(
    () => groupBy(services, ({ region }) => region),
    [services],
  );

  const regionServices = useMemo(
    () => groupedServicesByRegion[selectedRegion] || [],
    [selectedRegion, groupedServicesByRegion],
  );

  const groupedServicesBySupplier = useMemo(
    () => Object.entries(groupBy(regionServices, ({ supplier }) => supplier)),
    [regionServices],
  );

  const allRegions = useMemo(() => Object.values(ExistingRegions), []);

  const changeRegion = (region: ExistingRegions) => {
    setSelectedRegion(region);
  };

  const handleOnPinService = (
    serviceId: string,
    region: ExistingRegions,
    isActive: boolean,
  ) => {
    const servicesByRegion = pinnedServices[region] || [];

    if (isActive) {
      const filteredServices = servicesByRegion.filter(
        (pinnedId) => pinnedId !== serviceId,
      );
      setAllPinedServices({ ...pinnedServices, [region]: filteredServices });
      return;
    }

    setAllPinedServices({
      ...pinnedServices,
      [region]: [...servicesByRegion, serviceId],
    });
  };

  const handleOnClickService = (
    region: ExistingRegions,
    productId: string,
    isManual: boolean,
  ) => {
    handleCloseModal();

    if (isManual) {
      dispatch(orderActions.setProductToScroll(productId));
    }

    if (isOrderStarted || orderProducts?.length) {
      let regionIndex = mockedData.findIndex(
        (el) => el.region === region,
      );

      if (regionIndex < 0) regionIndex = mockedData.findIndex((el) => el.region);

      let serviceIndex = mockedData[regionIndex].services.findIndex(
        (el) => el.productId === productId,
      );
      serviceIndex = serviceIndex >= 0 ? serviceIndex : 0;

      if (regionIndex === currentRegion) {
        dispatch(orderActions.setSelectedService(serviceIndex));

        return;
      }

      dispatch(orderActions.setResetOrder({
        isModalVisible: true,
        regionToChange: regionIndex,
        serviceToChange: serviceIndex,
      }));
      return;
    }

    dispatch(
      orderActions.setInitialOrderData({
        region,
        productId,
      }),
    );
    navigate(`/${region.toLocaleLowerCase()}`);
  };

  const handleCloseModal = () => {
    dispatch(servicesActions.setServicesModal(false));
  };

  return (
    <Wrapper>
      <AllServicesStyled>
        <IconWrap onClick={handleCloseModal}>
          <CloseIcon />
        </IconWrap>
        <Regions
          selectedRegion={selectedRegion}
          setSelectedRegions={changeRegion}
          allRegions={allRegions}
        />
        <GroupedServicesWrap>
          {groupedServicesBySupplier.map(([name, servicesArr]) => (
            <GroupedService
              key={name}
              services={servicesArr}
              name={name}
              onPin={handleOnPinService}
              serviceOnClick={handleOnClickService}
              pinnedServices={pinnedServices[selectedRegion] || []}
            />
          ))}
        </GroupedServicesWrap>
        <Footer />
      </AllServicesStyled>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  bottom: 0;
  overflow-y: hidden;
  z-index: 10000;
  background-color: #f1efe9;
`;

const AllServicesStyled = styled.div`
  padding: 32px;
  width: calc(100% - 4px);
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  overflow-y: auto;
  scrollbar-color: rgba(163, 163, 163, 0.7);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(163, 163, 163, 0.7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    background: transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const IconWrap = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  cursor: pointer;
`;

const GroupedServicesWrap = styled.div`
  flex: 1 0 auto;
  display: flex;
  column-gap: 16px;
  row-gap: 24px;
  flex-wrap: wrap;
`;

export default AllServices;
