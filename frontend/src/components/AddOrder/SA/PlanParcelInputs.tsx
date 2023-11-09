import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import SelectWithLabel from '@/components/SelectWithLabel';

import { initializeOrderAction } from '@/store/actions/orderActions';

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

const planTypes = [
  'Deposited Plan',
  'Community Plan',
  'Filed Plan',
  'Hundred Plan',
  'Road Plan',
  'Strata Plan',
  'Township Plan',
];

const TitleInputs: React.FC = () => {
  const [planType, setPlanType] = useState(0);
  const [parcel, setParcel] = useInput();
  const [planNumber, setPlanNumber] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const data = useSelector(selectInitialOrderData);
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
    setParcel(data?.parcelNumber || '');
    setPlanNumber(data?.planNumber || '');
    setPlanType(planTypes.findIndex((item) => item.startsWith(data?.planType || 'D')));
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      await dispatch(
        initializeOrderAction(
          currentService.region,
          `${currentService.region}: ${currentService.label}`,
          {
            productId: currentService.productId,
            identifier: currentService.identifier!,
            input: {
              matterReference: matter,
              ...(parcel.trim() ? { parcelNumber: parcel.trim() } : {}),
              planType: planTypes[planType][0],
              planNumber: planNumber.trim(),
            },
          },
        ),
      );

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isParcelError = useMemo(() => (
    servicesValidation(parcel.trim(), currentService.productId, 'Parcel')
  ), [parcel, isFirstRender]);

  const isPlanNumberError = useMemo(() => (
    servicesValidation(planNumber.trim(), currentService.productId, 'Plan Number', true)
  ), [planNumber, isFirstRender]);

  const isUnableToRequest = !!(isParcelError || isPlanNumberError || isFirstRender);

  return (
    <>
      <VolumeFolio ref={inputsRef}>
        <Input
          value={parcel}
          onChange={setParcel}
          label="Parcel"
          labelColor="var(--primary-dark-color)"
          placeholder="e.g 2"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isParcelError}
          errorMessage={isParcelError}
        />
        <SelectWithLabel
          label="Plan Type"
          labelColor="var(--primary-dark-color)"
          selectedItem={planType}
          setSelectedItem={setPlanType}
          items={planTypes}
          isRequired
        />
        <Input
          value={planNumber}
          label="Plan Number"
          labelColor="var(--primary-dark-color)"
          onChange={setPlanNumber}
          placeholder="e.g 45754"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isPlanNumberError}
          errorMessage={isPlanNumberError}
          isRequired
          required
        />
        <ServiceButton
          text={
            isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'
          }
          marginTop={isButtonPressed && isUnableToRequest ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && isUnableToRequest ? 'auto' : 'flex-end'}
          align="flex-start"
          onClick={search}
        />
      </VolumeFolio>
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

const VolumeFolio = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  grid-gap: 0.75rem;
`;

export default TitleInputs;
