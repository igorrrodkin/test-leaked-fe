import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import {
  initializeOrderAction,
} from '@/store/actions/orderActions';

import {
  selectCurrentService,
  selectInitialOrderData,
  selectMatter,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import getInputPlaceholder from '@/utils/getInputPlaceholder';
import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const AddressInputs = () => {
  const [streetNumber, setStreetNumber] = useInput();
  const [streetName, setStreetName] = useInput();
  const [suburb, setSuburb] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const matter = useSelector(selectMatter);
  const data = useSelector(selectInitialOrderData);

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();
  const isEnterPressed = useKeyPress('Enter');

  useEffect(() => {
    if (isEnterPressed && inputsRef.current) {
      const { activeElement } = document;

      if (inputsRef.current.contains(activeElement)) {
        search();
      }
    }
  }, [isEnterPressed]);

  useEffect(() => {
    if (data) {
      setStreetName(data?.street || '');
      setStreetNumber(data?.streetNumber || '');
      setSuburb(data?.suburb || '');
    }
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const trimmedStreetNumber = streetNumber.trim();
      const trimmedStreetName = streetName.trim();
      const trimmedSuburb = suburb.trim();

      const description = [
        trimmedStreetNumber,
        trimmedStreetName,
        trimmedSuburb,
      ].join(' ').trim();

      await dispatch(
        initializeOrderAction(
          currentService.region,
          `${currentService.region}: ${currentService.label}`,
          {
            productId: currentService.productId,
            identifier: currentService.identifier!,
            input: {
              street: trimmedStreetName,
              locality: trimmedSuburb,
              ...(trimmedStreetNumber ? { number: trimmedStreetNumber } : {}),
              matterReference: matter,
            },
          },
          description,
        ),
      );

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isStreetNumberError = useMemo(() => (
    servicesValidation(streetNumber.trim(), currentService.productId, 'Street Number')
  ), [streetNumber, isFirstRender]);

  const isStreetNameError = useMemo(() => (
    servicesValidation(streetName.trim(), currentService.productId, 'Street Name', true)
  ), [streetName, isFirstRender]);

  const isSuburbError = useMemo(() => (
    servicesValidation(suburb.trim(), currentService.productId, 'Suburb', true)
  ), [suburb, isFirstRender]);

  const isUnableToRequest = !!(isStreetNumberError || isStreetNameError || isSuburbError || isFirstRender);

  return (
    <>
      <StyledAddressInputs ref={inputsRef}>
        <Input
          value={streetNumber}
          label="Street Number"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetNumber}
          placeholder="e.g 16"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isStreetNumberError}
          errorMessage={isStreetNumberError}
        />
        <Input
          value={streetName}
          label="Street Name"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetName}
          placeholder={getInputPlaceholder[currentService.region] ? getInputPlaceholder[currentService.region].Address.streetName : ''}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isStreetNameError}
          errorMessage={isStreetNameError}
          isRequired
          required
        />
        <Input
          value={suburb}
          label="Suburb"
          labelColor="var(--primary-dark-color)"
          onChange={setSuburb}
          placeholder={getInputPlaceholder[currentService.region] ? getInputPlaceholder[currentService.region].Address.suburb : ''}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isSuburbError}
          errorMessage={isSuburbError}
          isRequired
          required
        />
      </StyledAddressInputs>
      {currentService.serviceDisclaimer && (
        <Disclaimer
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
          isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'
        }
        align="flex-start"
        price={currentService.priceInclGST}
        onClick={search}
      />
    </>
  );
};

const StyledAddressInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export default AddressInputs;
