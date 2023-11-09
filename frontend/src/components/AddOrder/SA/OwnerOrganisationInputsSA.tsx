import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { orderActions, verifyAction } from '@/store/actions/orderActions';

import { selectCurrentService, selectMatter } from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const OwnerOrganisationInputsSA = () => {
  const [acn, setAcn] = useInput();
  const [orgOrSurname, setOrgOrSurname] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

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

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const orderItemInputs: any = {
        ...(acn ? { acn: acn.trim() } : {}),
        orgOrSurname: orgOrSurname.trim(),
        matterReference: matter,
      };

      dispatch(orderActions.setVerifyTempData({
        identifier: 'HTONSS1',
        description: `${orgOrSurname} ${acn}`.trim(),
      }));

      await dispatch(verifyAction({
        matter,
        region: currentService.region,
        input: orderItemInputs,
        identifier: 'HTONSS1',
      }));

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isOrgNameOrSurnameError = useMemo(() => (
    servicesValidation(orgOrSurname.trim(), currentService.productId, 'Organisation Name or Surname', true)
  ), [orgOrSurname, isFirstRender]);

  const isACNError = useMemo(() => (
    servicesValidation(acn.trim(), currentService.productId, 'ACN')
  ), [acn, isFirstRender]);

  const isUnableToRequest = !!(isOrgNameOrSurnameError || isACNError || isFirstRender);

  return (
    <>
      <Owner ref={inputsRef}>
        <Input
          value={orgOrSurname}
          label="Organisation Name"
          labelColor="var(--primary-dark-color)"
          onChange={setOrgOrSurname}
          placeholder="e.g. Acme"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isOrgNameOrSurnameError}
          errorMessage={isOrgNameOrSurnameError}
          isRequired
          required
        />
        <Input
          value={acn}
          label="ACN"
          labelColor="var(--primary-dark-color)"
          onChange={setAcn}
          placeholder="e.g. 604937439"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isACNError}
          errorMessage={isACNError}
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

export default OwnerOrganisationInputsSA;
