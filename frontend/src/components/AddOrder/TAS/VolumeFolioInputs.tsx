import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Disclaimer } from '@/components/AddOrder/Page/ResultTable';
import ServiceButton from '@/components/AddOrder/ServiceButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { orderActions } from '@/store/actions/orderActions';

import { IFoundedItems } from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';

import {
  selectCurrentService,
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

const VolumeFolioInputs: React.FC = () => {
  const [volumeFolio, setVolumeFolio] = useInput();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();

  const matter = useSelector(selectMatter);
  const currentService = useSelector(selectCurrentService)!;
  const productId = currentService.productId!;
  const identifier = currentService.identifier!;
  const foundedItems = useSelector(selectFoundedItems);
  const orderProducts = useSelector(selectOrderProducts) || [];
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

    const result = volumeFolio.trim();

    if (foundedItems && foundedItems[productId]?.find((el) => el.id === result)) {
      dispatch(orderActions.setSearchError(`Item ${result} already added`));

      return;
    }

    try {
      toggleIsLoading(true);

      const orderProduct: IFoundedItems = {
        id: result,
        identifier,
        description: result,
        isChosen: true,
        type: FullfilmentType.MANUAL,
        productId,
        price: currentService?.priceInclGST || '0.00',
        searchDescription: result,
        render: {
          criteria: result,
          searchedBy: 'Volume/Folio',
        },
        manualInputs: [
          {
            key: 'volumeFolio',
            value: result,
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
        <Input
          value={volumeFolio}
          label="Volume/Folio"
          labelColor="var(--primary-dark-color)"
          onChange={setVolumeFolio}
          placeholder="e.g 2146/36"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isVolumeFolioError}
          errorMessage={isVolumeFolioError}
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
  grid-template-columns: 1fr auto;
  grid-gap: 0.75rem;
`;

export default VolumeFolioInputs;
