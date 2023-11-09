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

import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const OwnerOrganisationInputs = () => {
  const [companyName, setCompanyName] = useInput();
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
    setCompanyName(data?.companyName || '');
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const orderItemInputs: any = {
        name: companyName.trim(),
        matterReference: matter,
      };

      await dispatch(initializeOrderAction(
        currentService.region,
        `${currentService.region}: ${currentService.label}`,
        {
          productId: currentService.productId,
          identifier: currentService.identifier!,
          input: orderItemInputs,
        },
      ));

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isCompanyNameError = useMemo(() => (
    servicesValidation(companyName.trim(), currentService.productId, 'Company Name', true)
  ), [companyName, isFirstRender]);

  const isUnableToRequest = !!(isCompanyNameError || isFirstRender);

  return (
    <>
      <Owner ref={inputsRef}>
        <Input
          value={companyName}
          label="Company Name"
          labelColor="var(--primary-dark-color)"
          onChange={setCompanyName}
          placeholder="e.g Acme Corporation"
          style={{ marginBottom: '0px' }}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isCompanyNameError}
          errorMessage={isCompanyNameError}
          required
        />
        <ServiceButton
          text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'}
          marginTop={isButtonPressed && isCompanyNameError ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && isCompanyNameError ? 'auto' : 'flex-end'}
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
  grid-template-columns: 1fr auto;
  grid-gap: .75rem;
`;

export default OwnerOrganisationInputs;
