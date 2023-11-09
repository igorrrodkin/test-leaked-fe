import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { initializeOrderAction } from '@/store/actions/orderActions';

import { selectCurrentService, selectInitialOrderData, selectMatter } from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import { ExistingRegions } from '@/utils/getRegionsData';
import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const OwnerIndividualInputsQLD = () => {
  const [firstName, setFirstName] = useInput();
  const [lastName, setLastName] = useInput();
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
    if (data?.region !== ExistingRegions.QLD) {
      return;
    }

    setFirstName(data?.firstName || '');
    setLastName(data?.surname || '');
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const orderItemInputs: any = {
        surname: lastName,
        ...(firstName ? { givenNames: firstName } : {}),
        matterReference: matter,
      };

      const description = `${firstName} ${lastName}`.trim();

      await dispatch(initializeOrderAction(
        currentService.region,
        `${currentService.region}: ${currentService.label}`,
        {
          productId: currentService.productId,
          identifier: currentService.identifier!,
          input: orderItemInputs,
        },
        description,
      ));

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isFirstNameError = useMemo(() => (
    servicesValidation(firstName.trim(), currentService.productId, 'First Name')
  ), [firstName, isFirstRender]);

  const isLastNameError = useMemo(() => (
    servicesValidation(lastName.trim(), currentService.productId, 'Last Name', true)
  ), [lastName, isFirstRender]);

  const isUnableToRequest = !!(isFirstNameError || isLastNameError || isFirstRender);

  return (
    <>
      <Owner ref={inputsRef}>
        <Input
          value={firstName}
          label="First Name"
          labelColor="var(--primary-dark-color)"
          onChange={setFirstName}
          placeholder="e.g John"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isFirstNameError}
          errorMessage={isFirstNameError}
        />
        <Input
          value={lastName}
          label="Last Name"
          labelColor="var(--primary-dark-color)"
          onChange={setLastName}
          placeholder="e.g Smith"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isLastNameError}
          errorMessage={isLastNameError}
          isRequired
          required
        />
        <ServiceButton
          text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'}
          marginTop={isButtonPressed && isUnableToRequest ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && isUnableToRequest ? 'auto' : 'flex-end'}
          align="flex-start"
          onClick={search}
        />
      </Owner>
      {currentService.serviceDisclaimer && (
        <Disclaimer
          marginTop="12px"
          marginBottom="0"
          padding="0"
          border="none"
          color="rgba(0, 0, 0, .5)"
        >
          {currentService.serviceDisclaimer}
        </Disclaimer>
      )}
    </>
  );
};

const Owner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: .75rem;
`;

export default OwnerIndividualInputsQLD;
