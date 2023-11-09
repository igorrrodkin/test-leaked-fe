import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { orderActions } from '@/store/actions/orderActions';

import {
  selectCurrentService,
  selectMatter,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import getInputPlaceholder from '@/utils/getInputPlaceholder';
import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const TitleInputs = () => {
  const [referenceNumber, setReferenceNumber] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const orderProducts = useSelector(selectOrderProducts) || [];
  const matter = useSelector(selectMatter);

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();
  const isEnterPressed = useKeyPress('Enter');

  useEffect(() => {
    if (isEnterPressed && inputsRef.current) {
      const { activeElement } = document;

      if (inputsRef.current.contains(activeElement)) {
        verify();
      }
    }
  }, [isEnterPressed]);

  const verify = async () => {
    try {
      toggleIsButtonPressed(true);
      dispatch(orderActions.setSearchError(null));

      if (isUnableToRequest || isLoading) return;

      const isMatterError = validateMatter(matter);

      if (isMatterError) {
        dispatch(orderActions.setIsMatterError(isMatterError));
        return;
      }

      toggleIsLoading(true);

      const titleRef = referenceNumber.replaceAll('-', '/').trim();

      const isItemExist = orderProducts.findIndex((el) => el.id === titleRef);

      if (isItemExist !== -1) {
        dispatch(orderActions.setSearchError('Item already added to order'));
        toggleIsLoading(false);
        toggleIsButtonPressed(false);
        return;
      }

      dispatch(orderActions.setOrderProducts([
        ...orderProducts,
        {
          id: titleRef,
          description: titleRef,
          identifier: currentService.identifier!,
          verificationIdentifier: currentService.identifier!,
          price: currentService.priceInclGST,
          render: {
            titleReference: titleRef,
          },
          isChosen: false,
          isUnable: true,
          productId: currentService.productId,
          type: currentService.fulfilmentType,
          searchDescription: titleRef,
          inputs: {
            titleReference: titleRef,
            matterReference: matter,
          },
        },
      ]));

      setReferenceNumber('');
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isTitleReferenceError = useMemo(() => (
    servicesValidation(referenceNumber.trim(), currentService.productId, 'Title Reference', true)
  ), [referenceNumber, isFirstRender]);

  const isUnableToRequest = !!(isTitleReferenceError || isFirstRender);

  const cs = getInputPlaceholder[currentService.region];
  const titleReferencePlaceholder = cs && cs['Title Reference']
    ? cs['Title Reference'].titleReference
    : '';

  return currentService ? (
    <>
      <TitleReference ref={inputsRef}>
        <Input
          label="Title Reference"
          labelColor="var(--primary-dark-color)"
          value={referenceNumber}
          onChange={setReferenceNumber}
          placeholder={titleReferencePlaceholder}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isTitleReferenceError}
          errorMessage={isTitleReferenceError}
          required
        />
        <ServiceButton
          text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Verify'}
          marginTop={isButtonPressed && !!isTitleReferenceError ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && !!isTitleReferenceError ? 'auto' : 'flex-end'}
          isMovedToTheLeft
          onClick={verify}
        />
      </TitleReference>
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
  ) : <Loader marginBottom="16px" />;
};

const TitleReference = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

export default TitleInputs;
