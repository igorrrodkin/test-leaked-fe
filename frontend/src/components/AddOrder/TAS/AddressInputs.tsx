import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import {
  orderActions,
} from '@/store/actions/orderActions';

import { IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService, selectFoundedItems,
  selectInitialOrderData,
  selectMatter, selectOrderManuallyProducts, selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const AddressInputs = () => {
  const [unitNumber, setUnitNumber] = useInput();
  const [streetNumber, setStreetNumber] = useInput();
  const [streetName, setStreetName] = useInput();
  const [suburb, setSuburb] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const productId = currentService.productId!;
  const identifier = currentService.identifier!;
  const matter = useSelector(selectMatter);
  const data = useSelector(selectInitialOrderData);
  const foundedItems = useSelector(selectFoundedItems);
  const orderProducts = useSelector(selectOrderProducts) || [];
  const orderManualProducts = useSelector(selectOrderManuallyProducts) || [];

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();
  const isEnterPressed = useKeyPress('Enter');

  useEffect(() => {
    if (data) {
      setStreetName(data?.street || '');
      setUnitNumber(data?.unitNumber || '');
      setStreetNumber(data?.streetNumber || '');
      setSuburb(data?.suburb || '');
    }
  }, [data]);

  useEffect(() => {
    if (isEnterPressed && inputsRef.current) {
      const { activeElement } = document;

      if (inputsRef.current.contains(activeElement)) {
        add();
      }
    }
  }, [isEnterPressed]);

  const add = async () => {
    toggleIsButtonPressed(true);
    dispatch(orderActions.setSearchError(null));

    if (isUnableToRequest || isLoading) return;

    const isMatterError = validateMatter(matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return;
    }

    const trimmedUnitNumber = unitNumber.trim();
    const trimmedStreetNumber = streetNumber.trim();
    const trimmedStreetName = streetName.trim();
    const trimmedSuburb = suburb.trim();

    const result = [
      trimmedUnitNumber,
      trimmedStreetNumber,
      trimmedStreetName,
      trimmedSuburb,
    ].join(' ');

    if (foundedItems && foundedItems[productId]?.find((el) => el.id === result)) {
      dispatch(orderActions.setSearchError(`Item ${result} already added`));

      return;
    }

    try {
      toggleIsLoading(true);

      const orderProduct: IFoundedItems = {
        id: result,
        identifier,
        description: result,
        isChosen: true,
        type: FullfilmentType.MANUAL,
        productId,
        price: currentService?.priceInclGST || '0.00',
        searchDescription: result,
        render: {
          criteria: result,
          searchedBy: 'Address',
        },
        manualInputs: [
          ...(trimmedUnitNumber ? [{ key: 'unitNumber', value: trimmedUnitNumber }] : []),
          ...(trimmedStreetNumber ? [{ key: 'streetNumber', value: trimmedStreetNumber }] : []),
          {
            key: 'streetName',
            value: trimmedStreetName,
          },
          {
            key: 'suburb/Locality',
            value: trimmedSuburb,
          },
        ],
      };

      dispatch(orderActions.setOrderManuallyProducts({
        ...orderManualProducts,
        [productId]: [
          ...orderManualProducts[productId],
          orderProduct,
        ],
      }));
      dispatch(orderActions.setOrderProducts([
        ...orderProducts,
        orderProduct,
      ]));
      dispatch(orderActions.setIsOrderStarted(true));
      setUnitNumber('');
      setStreetNumber('');
      setStreetName('');
      setSuburb('');
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isUnitNumberError = useMemo(() => (
    servicesValidation(unitNumber.trim(), productId, 'Unit Number')
  ), [unitNumber, isFirstRender]);

  const isStreetNumberError = useMemo(() => (
    servicesValidation(streetNumber.trim(), productId, 'Street Number')
  ), [streetNumber, isFirstRender]);

  const isStreetNameError = useMemo(() => (
    servicesValidation(streetName.trim(), productId, 'Street Name', true)
  ), [streetName, isFirstRender]);

  const isSuburbError = useMemo(() => (
    servicesValidation(suburb.trim(), productId, 'Suburb', true)
  ), [suburb, isFirstRender]);

  const isUnableToRequest = !!(isStreetNumberError || isStreetNameError || isSuburbError || isFirstRender);

  return (
    <div ref={inputsRef}>
      <StyledAddressInputs>
        <Input
          value={unitNumber}
          label="Unit Number"
          labelColor="var(--primary-dark-color)"
          onChange={setUnitNumber}
          placeholder=""
          inputMarginBottom="0"
          isError={isButtonPressed && !!isUnitNumberError}
          errorMessage={isUnitNumberError}
        />
        <Input
          value={streetNumber}
          label="Street Number"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetNumber}
          placeholder=""
          inputMarginBottom="0"
          isError={isButtonPressed && !!isStreetNumberError}
          errorMessage={isStreetNumberError}
        />
        <Input
          value={streetName}
          label="Street Name"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetName}
          placeholder=""
          inputMarginBottom="0"
          isError={isButtonPressed && !!isStreetNameError}
          errorMessage={isStreetNameError}
          isRequired
          required
        />
        <Input
          value={suburb}
          label="Suburb/Locality"
          labelColor="var(--primary-dark-color)"
          onChange={setSuburb}
          placeholder=""
          inputMarginBottom="0"
          isError={isButtonPressed && !!isSuburbError}
          errorMessage={isSuburbError}
          isRequired
          required
        />
      </StyledAddressInputs>
      {currentService.serviceDisclaimer && (
        <Disclaimer
          marginTop="12px"
          marginBottom="24px"
          padding="0"
          border="none"
          color="rgba(0, 0, 0, .5)"
        >
          {currentService.serviceDisclaimer}
        </Disclaimer>
      )}
      <ServiceButton
        text={
          isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Add'
        }
        align="flex-start"
        price="Free"
        onClick={add}
      />
    </div>
  );
};

const StyledAddressInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
  margin-bottom: 12px;
`;

export default AddressInputs;
