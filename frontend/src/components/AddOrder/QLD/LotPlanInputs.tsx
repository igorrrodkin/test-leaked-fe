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

import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const LotPlanInputs: React.FC = () => {
  const [referenceNumber, setReferenceNumber] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const orderProducts = useSelector(selectOrderProducts) || [];
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
      dispatch(orderActions.setSearchError(null));

      if (isUnableToRequest || isLoading) return;

      const isMatterError = validateMatter(matter);

      if (isMatterError) {
        dispatch(orderActions.setIsMatterError(isMatterError));
        return;
      }

      toggleIsLoading(true);

      const isItemExist = orderProducts.findIndex((el) => el.id === referenceNumber);

      if (isItemExist !== -1) {
        dispatch(orderActions.setSearchError('Item already added to order'));
        toggleIsLoading(false);
        toggleIsButtonPressed(false);
        return;
      }

      const lotPlan = referenceNumber.replace(/\//g, '');
      const [lot, plan] = lotPlan.split(/[a-zA-Z]{1,4}/);
      const planType = lotPlan.replace(/[0-9]/g, '');

      dispatch(
        orderActions.setOrderProducts([
          ...orderProducts,
          {
            id: referenceNumber,
            description: referenceNumber,
            identifier: currentService.identifier!,
            verificationIdentifier: currentService.identifier!,
            price: currentService.priceInclGST,
            render: {
              titleReference: '',
            },
            isChosen: false,
            isUnable: true,
            isVerified: false,
            productId: currentService.productId,
            type: currentService.fulfilmentType,
            searchDescription: referenceNumber,
            inputs: {
              lot,
              plan,
              planType,
              matterReference: matter,
            },
          },
        ]),
      );

      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isReferenceNumberError = useMemo(
    () => servicesValidation(referenceNumber.trim(), currentService.productId, 'Lot/Plan Number', true),
    [referenceNumber, isFirstRender],
  );

  const isUnableToRequest = !!(isReferenceNumberError || isFirstRender);

  return (
    <>
      <LotPlan ref={inputsRef}>
        <Input
          value={referenceNumber}
          label="Lot/Plan Number"
          labelColor="var(--primary-dark-color)"
          onChange={setReferenceNumber}
          placeholder="e.g 8/RP601844"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isReferenceNumberError}
          errorMessage={isReferenceNumberError}
          required
        />
        <ServiceButton
          text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Verify'}
          marginTop={isButtonPressed && isReferenceNumberError ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && isReferenceNumberError ? 'auto' : 'flex-end'}
          isMovedToTheLeft
          onClick={search}
        />
      </LotPlan>
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

const LotPlan = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

export default LotPlanInputs;
