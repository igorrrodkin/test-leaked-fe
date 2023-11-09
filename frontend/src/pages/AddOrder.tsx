import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Footer from '@/components/AddOrder/Footer';
import PropertyInformation from '@/components/AddOrder/Page/PropertyInformation';
import StandardSearches from '@/components/AddOrder/Page/StandardSearches';
import TitleSearch from '@/components/AddOrder/Page/TitleSearch';

import {
  orderActions,
} from '@/store/actions/orderActions';
import { userActions } from '@/store/actions/userActions';

import {
  selectInitialOrderData,
  selectSelectedRegion,
  selectSelectedService,
  selectServices,
} from '@/store/selectors/orderSelectors';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const mockedData = getRegionsData();

type AddOrderProps = {
  region: ExistingRegions;
};

const AddOrder: FC<AddOrderProps> = ({ region }) => {
  const selectedRegion = useSelector(selectSelectedRegion);
  const selectedService = useSelector(selectSelectedService);
  const initialOrderData = useSelector(selectInitialOrderData);
  const services = useSelector(selectServices);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let regionIndex = mockedData.findIndex(
      (el) => el.region === region,
    );
    if (regionIndex < 0) regionIndex = mockedData.findIndex((el) => el.region);

    dispatch(orderActions.setSelectedRegion(regionIndex));
  }, []);

  useEffect(() => () => {
    dispatch(userActions.setOrderDetails(null));
    dispatch(orderActions.cleanCurrentOrder());
  }, []);

  useEffect(() => {
    if (!initialOrderData) {
      return;
    }

    if (initialOrderData.matter) {
      dispatch(orderActions.setMatter(initialOrderData.matter));
    }

    let regionIndex = mockedData.findIndex(
      (el) => el.region === initialOrderData.region,
    );
    if (regionIndex < 0) regionIndex = mockedData.findIndex((el) => el.region);

    dispatch(orderActions.setSelectedRegion(regionIndex));

    if (initialOrderData.identifier) {
      const serviceIndex = mockedData[regionIndex].services.findIndex(
        (el) => el.identifier === initialOrderData.identifier,
      );

      dispatch(orderActions.setSelectedService(serviceIndex >= 0 ? serviceIndex : 0));
    }

    if (initialOrderData.productId) {
      const serviceIndex = mockedData[regionIndex].services.findIndex(
        (el) => el.productId === initialOrderData.productId,
      );

      dispatch(orderActions.setSelectedService(serviceIndex >= 0 ? serviceIndex : 0));
    }
  }, [initialOrderData]);

  useEffect(() => {
    if (mockedData[selectedRegion].services.length && services) {
      const foundedCurrentService = services.find(
        (el) => el.productId
          === mockedData[selectedRegion].services[selectedService].productId,
      );

      if (foundedCurrentService) {
        const service = mockedData[selectedRegion].services[selectedService];
        const cs = {
          ...foundedCurrentService,
          identifier: service.identifier,
          infotip: service.infotip,
        };

        dispatch(orderActions.setCurrentService(cs));
      } else {
        dispatch(orderActions.setCurrentService(null));
      }
    }
  }, [selectedRegion, selectedService, services]);

  return (
    <AddOrderPage>
      <PropertyInformation />
      {selectedRegion !== 0 && (
      <TitleSearch />
      )}
      <StandardSearches />
      <Footer />
    </AddOrderPage>
  );
};

const AddOrderPage = styled.section`
  padding: 32px 32px 134px;
  position: relative;

  * {
    letter-spacing: -0.03em;
  }
`;

export const Content = styled.div`
  padding: 32px;
  border-radius: 12px;
  background-color: #fff;
`;

export const SubTitle = styled.p<{ marginBottom?: number, fontSize?: number, fontWeight?: number }>`
  display: flex;
  align-items: center;
  grid-gap: 4px;
  margin-bottom: ${({ marginBottom = 16 }) => marginBottom}px;
  font-size: ${({ fontSize = 16 }) => fontSize}px;
  color: var(--primary-dark-color);
  font-weight: ${({ fontWeight = 500 }) => fontWeight};
`;

export const Tips = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-gap: 16px;
`;

export const Tip = styled.span<{ isSelected: boolean; width?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 16px;
  width: ${({ width }) => (width ? `${width}px}` : 'auto')};
  height: 38px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ isSelected }) => (isSelected ? 'var(--primary-green-color)' : 'rgba(0, 0, 0, .5)')};
  border: 1px solid ${({ isSelected }) => (isSelected ? 'var(--primary-green-color)' : 'rgba(35, 35, 35, 0.16)')};
  border-radius: 4px;
  background-color: ${({ isSelected }) => (isSelected ? 'var(--primary-green-background-color)' : 'unset')};
  cursor: pointer;

  :hover {
    border: 1px solid var(--primary-green-color);
  }
`;

export default AddOrder;
