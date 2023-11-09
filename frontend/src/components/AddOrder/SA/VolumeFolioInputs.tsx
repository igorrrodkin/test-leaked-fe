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

import { orderActions } from '@/store/actions/orderActions';

import { IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
  selectCurrentServiceName,
  selectFoundedItems,
  selectMatter,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const registers = ['CT', 'CL', 'CR'];

const TitleInputs: React.FC = () => {
  const [register, setRegister] = useState(0);
  const [volumeFolio, setVolumeFolio] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();

  const matter = useSelector(selectMatter);
  const currentService = useSelector(selectCurrentService)!;
  const productId = currentService.productId!;
  const foundedItems = useSelector(selectFoundedItems);
  const orderProducts = useSelector(selectOrderProducts) || [];
  const currentServiceName = useSelector(selectCurrentServiceName);
  const orderManualProducts = useSelector(selectOrderManuallyProducts) || [];
  const inputsRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();
  const isEnterPressed = useKeyPress('Enter');

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

    const result = registers[register] + volumeFolio.trim();

    if (foundedItems && foundedItems[productId]?.find((el) => el.id === result)) {
      dispatch(orderActions.setSearchError(`Item ${result} already added`));

      return;
    }

    try {
      toggleIsLoading(true);

      const orderProduct: IFoundedItems = {
        id: result,
        description: result,
        isChosen: true,
        type: FullfilmentType.MANUAL,
        productId,
        identifier: 'HTBTRS',
        price: currentService?.priceInclGST || '0.00',
        searchDescription: result,
        render: {
          volumeFolio: result,
          searchedBy: currentServiceName,
        },
        manualInputs: [
          {
            key: 'volumeFolio',
            value: registers[register] + volumeFolio.trim(),
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
      setRegister(0);
      setVolumeFolio('');
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isVolumeFolioError = useMemo(() => (
    servicesValidation(volumeFolio.trim(), productId, 'Volume/Folio', true)
  ), [volumeFolio, isFirstRender]);

  const isUnableToRequest = !!(isVolumeFolioError || isFirstRender);

  return (
    <>
      <VolumeFolio ref={inputsRef}>
        <SelectWithLabel
          label="Prefix"
          labelColor="var(--primary-dark-color)"
          selectedItem={register}
          setSelectedItem={setRegister}
          items={registers}
          isRequired
        />
        <Input
          value={volumeFolio}
          label="Volume/Folio"
          labelColor="var(--primary-dark-color)"
          onChange={setVolumeFolio}
          placeholder="e.g 5359/705"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isVolumeFolioError}
          errorMessage={isVolumeFolioError}
          isRequired
          required
        />
        <ServiceButton
          text={
            isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Add'
          }
          marginTop={isButtonPressed && isVolumeFolioError ? '13px' : '0'}
          price="Free"
          alignSelf={isButtonPressed && isVolumeFolioError ? 'auto' : 'flex-end'}
          align="flex-start"
          onClick={add}
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
  grid-template-columns: auto 1fr auto;
  grid-gap: 0.75rem;
`;

export default TitleInputs;
