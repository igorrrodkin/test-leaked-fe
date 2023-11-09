import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PlaceOrderResultsTable from '@/components/AddOrder/Page/PlaceOrderResultsTable';
import Button from '@/components/Button';

import { placeOrderAction } from '@/store/actions/orderActions';

import { FinalProduct } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectOrderManuallyProducts,
  selectOrderProducts, selectPlaceOrderResults,
  selectSelectedRegion,
  selectVerifyResponsesStatus,
} from '@/store/selectors/orderSelectors';
import { selectPriceList } from '@/store/selectors/userSelectors';

import useToggle from '@/hooks/useToggle';

import getNounByForm from '@/utils/getNounByForm';
import getRegionsData from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const mockedData = getRegionsData();

const Footer = () => {
  const [isLoading, toggleIsLoading] = useToggle();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const { priceList } = useSelector(selectPriceList)!;
  const selectedRegion = useSelector(selectSelectedRegion);
  const orderProducts = useSelector(selectOrderProducts);
  const orderManualProducts = useSelector(selectOrderManuallyProducts);
  const placeOrderResults = useSelector(selectPlaceOrderResults);
  const isVerifyResponsesStatus = useSelector(selectVerifyResponsesStatus);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let currentPrice = 0;
    let currentItemsCount = 0;

    if (orderProducts) {
      const priceForTitle = priceList
        .find((el) => el.productCode === FinalProduct[mockedData[selectedRegion].region])
        ?.priceInclGST;

      orderProducts.forEach((el) => {
        if (el.type === FullfilmentType.AUTO && el.isChosen) {
          currentItemsCount += 1;
          currentPrice += Number(priceForTitle) || 0;
        }
      });
    }

    if (orderManualProducts) {
      Object.values(orderManualProducts).forEach((el) => {
        if (el.length) {
          el.forEach((item) => {
            if (item.isChosen) {
              currentItemsCount += 1;
              currentPrice += +item.price;
            }
          });
        }
      });
    }

    setTotalPrice(currentPrice);
    setTotalItemsCount(currentItemsCount);
  }, [orderProducts, orderManualProducts, selectedRegion]);

  const placeOrder = async () => {
    try {
      toggleIsLoading(true);

      const { region } = mockedData[selectedRegion];

      await dispatch(placeOrderAction(region));

      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  return (
    <>
      <StyledFooter>
        <Items>{`${getNounByForm(totalItemsCount, 'Item')}`}</Items>
        <Price>
          Total: $
          {(totalPrice / 100).toFixed(2)}
        </Price>
        <Button
          disabled={isLoading || !totalItemsCount || isVerifyResponsesStatus}
          onClick={() => placeOrder()}
        >
          {(isLoading || isVerifyResponsesStatus) ? 'Loading...' : 'Place Order'}
        </Button>
      </StyledFooter>
      {(!isLoading && placeOrderResults) && (
        <PlaceOrderResultsTable placeOrderResults={placeOrderResults} />
      )}
    </>
  );
};

const StyledFooter = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 256px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 32px;
  padding: 32px 48px;
  background-color: #fff;
  border-top: 1px solid rgba(35, 35, 35, 0.16);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 100;
`;

const Items = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  height: 38px;
  border: 1px solid #23232329;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

export default Footer;
