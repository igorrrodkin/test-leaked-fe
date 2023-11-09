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

import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const AddressInputs: React.FC = () => {
  const [level, setLevel] = useInput();
  const [lot, setLot] = useInput();
  const [unitNumber, setUnitNumber] = useInput();
  const [streetNumber, setStreetNumber] = useInput();
  const [streetName, setStreetName] = useInput();
  const [suburb, setSuburb] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const data = useSelector(selectInitialOrderData);
  const currentService = useSelector(selectCurrentService)!;
  const matter = useSelector(selectMatter);

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
      setLevel(data?.level || '');
      setLot(data?.lot || '');
      setUnitNumber(data?.unitNumber || '');
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

      const trimmedLevel = level.trim();
      const trimmedLot = lot.trim();
      const trimmedUnitNumber = unitNumber.trim();
      const trimmedStreetNumber = streetNumber.trim();
      const trimmedStreetName = streetName.trim();
      const trimmedSuburb = suburb.trim();

      const description = [
        trimmedLevel,
        trimmedLot,
        trimmedUnitNumber,
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
              ...(trimmedLevel ? { level: trimmedLevel } : {}),
              ...(trimmedLot ? { lot: trimmedLot } : {}),
              ...(trimmedUnitNumber ? { unitNumber: trimmedUnitNumber } : {}),
              ...(trimmedStreetNumber ? { streetNumber: trimmedStreetNumber } : {}),
              street: trimmedStreetName,
              ...(trimmedSuburb ? { locality: trimmedSuburb } : {}),
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

  const isLevelError = useMemo(() => (
    servicesValidation(level.trim(), currentService.productId, 'Level')
  ), [level, isFirstRender]);

  const isLotError = useMemo(() => (
    servicesValidation(lot.trim(), currentService.productId, 'Lot')
  ), [lot, isFirstRender]);

  const isUnitNumberError = useMemo(() => (
    servicesValidation(lot.trim(), currentService.productId, 'Unit Number')
  ), [lot, isFirstRender]);

  const isStreetNumberError = useMemo(() => (
    servicesValidation(streetNumber.trim(), currentService.productId, 'Street Number')
  ), [streetNumber, isFirstRender]);

  const isStreetNameError = useMemo(() => (
    servicesValidation(streetName.trim(), currentService.productId, 'Street Name', true)
  ), [streetName, isFirstRender]);

  const isSuburbError = useMemo(() => (
    servicesValidation(suburb.trim(), currentService.productId, 'Suburb')
  ), [suburb, isFirstRender]);

  const isUnableToRequest = !!(isLevelError
    || isLotError
    || isUnitNumberError
    || isStreetNumberError
    || isStreetNameError
    || isSuburbError
    || isFirstRender
  );

  return (
    <div ref={inputsRef}>
      <StyledAddressInputs>
        <Input
          value={level}
          label="Level"
          labelColor="var(--primary-dark-color)"
          onChange={setLevel}
          placeholder=""
          inputMarginBottom="0"
          isError={isButtonPressed && !!isLevelError}
          errorMessage={isLevelError}
        />
        <Input
          value={lot}
          label="Lot"
          labelColor="var(--primary-dark-color)"
          onChange={setLot}
          placeholder="e.g 200"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isLotError}
          errorMessage={isLotError}
        />
        <Input
          value={unitNumber}
          label="Unit Number"
          labelColor="var(--primary-dark-color)"
          onChange={setUnitNumber}
          placeholder="e.g 1"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isUnitNumberError}
          errorMessage={isUnitNumberError}
        />
        <Input
          value={streetNumber}
          label="Street Number"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetNumber}
          placeholder="e.g 12"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isStreetNumberError}
          errorMessage={isStreetNumberError}
        />
        <Input
          value={streetName}
          label="Street Name"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetName}
          placeholder="e.g Harold"
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
          placeholder="e.g AVONDALE HEIGHTS"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isSuburbError}
          errorMessage={isSuburbError}
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
          isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'
        }
        align="flex-start"
        price={currentService.priceInclGST}
        onClick={search}
      />
    </div>
  );
};

const StyledAddressInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.25rem;
  margin-bottom: 0.75rem;
`;

export default AddressInputs;
