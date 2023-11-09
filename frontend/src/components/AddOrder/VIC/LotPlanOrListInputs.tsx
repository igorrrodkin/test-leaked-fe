import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import SelectWithLabel from '@/components/SelectWithLabel';

import {
  initializeOrderAction,
} from '@/store/actions/orderActions';

import { selectCurrentService, selectInitialOrderData, selectMatter } from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import servicesValidation from '@/utils/servicesValidation';

const options = ['Lot/Plan', 'Lot List'];

const AddressInputs = () => {
  const [selectedLot, setSelectedLot] = useState(0);
  const [lotPlanNumber, setLotPlanNumber] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const inputsRef = useRef<HTMLDivElement>(null);

  const currentService = useSelector(selectCurrentService)!;
  const data = useSelector(selectInitialOrderData);
  const matter = useSelector(selectMatter);

  const dispatch = useDispatch<any>();
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
      setLotPlanNumber(data?.lotPlanNumber || '');
    }
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      let splitLotPlanNumber;

      if (/\//.test(lotPlanNumber)) {
        const [left, right] = lotPlanNumber.split('/');
        const splitRight = right.split(/(\D{2})/);
        splitLotPlanNumber = [
          left,
          splitRight[1],
          splitRight[2],
        ];
      } else {
        splitLotPlanNumber = lotPlanNumber.replace(/\//g, '').split(/(\D{2})/);
      }

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const orderItemInputs: any = {
        lot: splitLotPlanNumber[0],
        planType: splitLotPlanNumber[1],
        plan: splitLotPlanNumber[2],
        matterReference: matter,
      };

      await dispatch(
        initializeOrderAction(
          currentService.region,
          `${currentService.region}: ${currentService.label}`,
          {
            productId: currentService.productId,
            identifier: currentService.identifier!,
            input: orderItemInputs,
          },
          lotPlanNumber,
        ),
      );
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isLotPlanNumberError = useMemo(() => (
    servicesValidation(lotPlanNumber.trim(), currentService.productId, 'Lot/Plan Number', true)
  ), [lotPlanNumber, isFirstRender]);

  const isUnableToRequest = !!(isLotPlanNumberError || isFirstRender);

  return (
    <>
      <LotPlanOrList ref={inputsRef}>
        <SelectWithLabel
          label="Lot Plan or Lot List"
          labelColor="var(--primary-dark-color)"
          selectedItem={selectedLot}
          setSelectedItem={setSelectedLot}
          items={options}
        />
        <Input
          value={lotPlanNumber}
          label="Lot/Plan Number"
          labelColor="var(--primary-dark-color)"
          onChange={setLotPlanNumber}
          placeholder="e.g 8RP601844"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isLotPlanNumberError}
          errorMessage={isLotPlanNumberError}
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
      </LotPlanOrList>
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

const LotPlanOrList = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 0.75rem;
`;

export default AddressInputs;
