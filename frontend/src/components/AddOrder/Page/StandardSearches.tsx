import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ManualInputs from '@/components/AddOrder/manual/ManualInputs';
import MultipleOrderItem from '@/components/AddOrder/MultipleOrderItem';
import OrderItem from '@/components/AddOrder/OrderItem';

import { Content, SubTitle } from '@/pages/AddOrder';

import { selectProducts, selectSelectedRegion } from '@/store/selectors/orderSelectors';

import getRegionsData, { renderByClientSide, topSectionProductCodes } from '@/utils/getRegionsData';
import inputsConfig from '@/utils/inputsConfig';

const mockedData = getRegionsData();

const StandardSearches = () => {
  const selectedRegion = useSelector(selectSelectedRegion);
  const products = useSelector(selectProducts);

  const regionProducts = useMemo(() => products
    ?.filter((el) => el.region === mockedData[selectedRegion].region)
    .filter((el) => !topSectionProductCodes.find((code) => code === el.productId))
    .sort((a, b) => {
      if (inputsConfig[a.productId] && inputsConfig[b.productId]) {
        return inputsConfig[a.productId].sortOrder - inputsConfig[b.productId].sortOrder;
      }

      return 0;
    })
    .map((el, i, arr) => {
      const isLast = arr.length - i < 5;

      if (renderByClientSide.includes(el.productId)) {
        return (
          <ManualInputs
            key={el.productId}
            product={el}
            isLast={isLast}
          />
        );
      }

      const serviceInputs = inputsConfig[el.productId];

      if (serviceInputs && Array.isArray(serviceInputs.data)) {
        const mask = typeof serviceInputs?.mask === 'string' ? serviceInputs.mask : undefined;

        return (
          <OrderItem
            key={el.productId}
            productId={el.productId}
            name={el.label}
            price={el.priceInclGST}
            region={el.region}
            inputs={serviceInputs.data}
            disclaimer={el.serviceDisclaimer}
            mask={mask}
            isLast={isLast}
          />
        );
      }

      if (serviceInputs && !Object.keys(serviceInputs).length) return '';

      return (
        <MultipleOrderItem
          key={el.productId}
          name={el.label}
          price={el.priceInclGST}
          productId={el.productId}
          region={el.region}
          inputs={Object.entries(serviceInputs)}
          disclaimer={el.serviceDisclaimer}
          isLast={isLast}
        />
      );
    }), [products, selectedRegion]);

  return (
    <Content>
      <SubTitle>Standard Searches</SubTitle>
      <Description>
        Expand a product and select the references you want to purchase within it.
      </Description>
      <ul>
        {regionProducts?.length ? regionProducts : ''}
      </ul>
    </Content>
  );
};

const Description = styled.p`
  margin-bottom: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
`;

export default StandardSearches;
