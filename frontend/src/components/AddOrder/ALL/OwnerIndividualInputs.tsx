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
  selectMatter,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import isNumber from '@/utils/isNumber';
import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

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
  const [firstName, setFirstName] = useInput();
  const [otherName, setOtherName] = useInput();
  const [lastName, setLastName] = useInput();
  const [reason, setReason] = useState();
  const [isButtonPressed, toggleIsButtonPressed] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();

  const currentService = useSelector(selectCurrentService)!;
  const productId = currentService.productId!;
  const identifier = currentService.identifier!;
  const matter = useSelector(selectMatter);
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

  const add = async () => {
    try {
      toggleIsButtonPressed(true);
      dispatch(orderActions.setSearchError(null));

      if (isUnableToRequest || isLoading) return;

      const isMatterError = validateMatter(matter);

      if (isMatterError) {
        dispatch(orderActions.setIsMatterError(isMatterError));
        return;
      }

      const result = [firstName, otherName, lastName].join(' ').trim();

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
          lastName: lastName.trim(),
          orgNameOrName: result,
          reason: reasons[reason!],
        },
        manualInputs: [
          {
            key: 'lastName',
            value: lastName.trim(),
          },
          {
            key: 'reason',
            value: reasons[reason!],
          },
        ],
      };

      if (otherName.trim() && !isOtherNameError) {
        orderProduct.manualInputs!.unshift({
          key: 'otherName',
          value: otherName.trim(),
        });
        orderProduct.render = {
          ...orderProduct.render,
          otherName: otherName.trim(),
        };
      }

      if (firstName.trim() && !isFirstNameError) {
        orderProduct.manualInputs!.unshift({
          key: 'firstName',
          value: firstName.trim(),
        });
        orderProduct.render = {
          ...orderProduct.render,
          firstName: firstName.trim(),
        };
      }

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

      setFirstName('');
      setOtherName('');
      setLastName('');
      setReason(undefined);
      toggleIsButtonPressed(false);
      toggleIsLoading(false);
    } catch (e: any) {
      toggleIsLoading(false);
    }
  };

  const isFirstNameError = useMemo(() => (
    servicesValidation(firstName.trim(), currentService.productId, 'First Name')
  ), [firstName, isFirstRender]);

  const isOtherNameError = useMemo(() => (
    servicesValidation(otherName.trim(), currentService.productId, 'Other Name')
  ), [otherName, isFirstRender]);

  const isLastNameError = useMemo(() => (
    servicesValidation(lastName.trim(), currentService.productId, 'Last Name', true)
  ), [lastName, isFirstRender]);

  const isReasonError = useMemo(() => (
    !isNumber(reason)
  ), [reason, isFirstRender]);

  const isUnableToRequest = !!(isFirstNameError
    || isOtherNameError
    || isLastNameError
    || isReasonError
    || isFirstRender
  );

  return (
    <div ref={inputsRef}>
      <StyledOwnerInputs>
        <Input
          value={firstName}
          label="First Name"
          labelColor="#1A1C1E"
          onChange={setFirstName}
          placeholder="e.g Jon"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isFirstNameError}
          errorMessage={isFirstNameError}
        />
        <Input
          value={otherName}
          label="Other Name"
          labelColor="#1A1C1E"
          onChange={setOtherName}
          placeholder="e.g Michael"
          inputMarginBottom="0"
          isError={isButtonPressed && !!isOtherNameError}
          errorMessage={isOtherNameError}
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
      </StyledOwnerInputs>
      {currentService.serviceDisclaimer && (
        <Disclaimer
          marginTop="12px"
          marginBottom="24px"
          padding="0"
          border="none"
          color="rgba(0, 0, 0, .5)"
        >
          {currentService.serviceDisclaimer}
        </Disclaimer>
      )}
      <ServiceButton
        text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Add'}
        price={currentService.priceInclGST}
        align="flex-start"
        alignSelf="flex-end"
        onClick={add}
      />
    </div>
  );
};

const StyledOwnerInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export default OwnerIndividualInputs;
