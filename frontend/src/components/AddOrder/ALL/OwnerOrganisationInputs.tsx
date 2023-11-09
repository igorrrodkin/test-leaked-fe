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
  selectFoundedItems,
  selectInitialOrderData,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import isNumber from '@/utils/isNumber';
import servicesValidation from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const reasons = [
  'Conveyancing',
  'Historical research',
  'Land development',
  'Land management',
  'Government services',
  'Credit check',
  'Due dilligence',
  'Litigation',
  'Real Estate proposal',
  'Financing',
  'Other',
];

const OwnerIndividualInputs = () => {
  const [organisationName, setOrganisationName] = useInput();
  const [reason, setReason] = useState();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();

  const currentService = useSelector(selectCurrentService)!;
  const productId = currentService.productId!;
  const identifier = currentService.identifier!;
  const data = useSelector(selectInitialOrderData);
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

  useEffect(() => () => {
    dispatch(orderActions.setInitialOrderData(null));
  }, [data]);

  const add = () => {
    try {
      toggleIsButtonPressed(true);
      dispatch(orderActions.setSearchError(null));

      if (isUnableToRequest || isLoading) return;

      const result = [organisationName].join(' ').trim();

      if (foundedItems && foundedItems[productId]?.find((el) => el.id === result + reason)) {
        dispatch(orderActions.setSearchError(`Item ${result} already added`));

        return;
      }

      toggleIsLoading(true);

      const orderProduct: IFoundedItems = {
        id: result + reason,
        identifier,
        description: result,
        isChosen: true,
        type: FullfilmentType.MANUAL,
        productId: currentService.productId,
        price: currentService?.priceInclGST || '0.00',
        searchDescription: result,
        render: {
          orgNameOrName: result,
          reason: reasons[reason!],
        },
        manualInputs: [
          {
            key: 'organisationName',
            value: organisationName.trim(),
          },
          {
            key: 'reason',
            value: reasons[reason!],
          },
        ],
      };

      const existedItems = foundedItems && foundedItems[productId] ? foundedItems[productId] : [];

      dispatch(orderActions.setFoundedItems({
        ...foundedItems,
        [productId]: [...existedItems, orderProduct],
      }));
      dispatch(orderActions.setOrderManuallyProducts({
        ...orderManualProducts,
        [currentService.productId]: [...orderManualProducts[currentService.productId], orderProduct],
      }));
      dispatch(orderActions.setOrderProducts([
        ...orderProducts,
        orderProduct,
      ]));

      dispatch(orderActions.setIsOrderStarted(true));

      setOrganisationName('');
      setReason(undefined);
      toggleIsButtonPressed(false);
      toggleIsLoading(false);
    } catch (e: any) {
      toggleIsLoading(false);
    }
  };

  const isOrganisationNameError = useMemo(() => (
    servicesValidation(organisationName.trim(), currentService.productId, 'Organisation Name', true)
  ), [organisationName, isFirstRender]);

  const isReasonError = useMemo(() => (
    !isNumber(reason)
  ), [reason, isFirstRender]);

  const isUnableToRequest = !!(isOrganisationNameError || isReasonError || isFirstRender);

  return (
    <>
      <Owner ref={inputsRef}>
        <Input
          value={organisationName}
          label="Organisation Name"
          labelColor="var(--primary-dark-color)"
          onChange={setOrganisationName}
          placeholder="e.g Acme Property"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isOrganisationNameError}
          errorMessage={isOrganisationNameError}
          isRequired
          required
        />
        <SelectWithLabel
          label="Reason"
          labelColor="var(--primary-dark-color)"
          selectedItem={reason}
          setSelectedItem={setReason}
          items={reasons}
          isError={isButtonPressed && isReasonError}
          errorMessage="Reason is required"
          isRequired
        />
        <ServiceButton
          text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Add'}
          marginTop={isButtonPressed && isUnableToRequest ? '13px' : '0'}
          price={currentService.priceInclGST}
          alignSelf={isButtonPressed && isUnableToRequest ? 'auto' : 'flex-end'}
          align="flex-start"
          onClick={add}
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
  grid-template-columns: 2fr 1fr auto;
  grid-gap: .75rem;
`;

export default OwnerIndividualInputs;
