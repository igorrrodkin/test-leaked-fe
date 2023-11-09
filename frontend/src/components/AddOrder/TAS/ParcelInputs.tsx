import React, {
  useEffect,
  useMemo,
  useRef, useState,
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
  selectMatter,
  selectOrderManuallyProducts,
  selectOrderProducts,
} from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import { getRegionsSelectorData } from '@/utils/getRegionsData';
import isNumber from '@/utils/isNumber';
import servicesValidation, { validateMatter } from '@/utils/servicesValidation';

import { AppDispatch } from '@/store';

const districts = getRegionsSelectorData.ACT.district;

const ParcelInputs: React.FC = () => {
  const [district, setDistrict] = useState();
  const [section, setSection] = useInput();
  const [block, setBlock] = useInput();
  const [unit, setUnit] = useInput();
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

    const trimmedSection = section.trim();
    const trimmedBlock = block.trim();
    const trimmedUnit = unit.trim();

    const result = [
      districts[district!],
      `Section ${trimmedSection}`,
      `Block ${trimmedBlock}`,
      trimmedUnit ? `Unit ${trimmedUnit}` : '',
    ].join(' ');

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
          searchedBy: 'Parcel',
        },
        manualInputs: [
          {
            key: 'district',
            value: districts[district!],
          },
          {
            key: 'section',
            value: section,
          },
          {
            key: 'block',
            value: block,
          },
          ...(trimmedUnit ? [{ key: 'unit', value: trimmedUnit }] : []),
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
      setDistrict(undefined);
      setSection('');
      setBlock('');
      setUnit('');
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const isDistrictError = useMemo(() => (
    !isNumber(district)
  ), [district, isFirstRender]);

  const isSectionError = useMemo(() => (
    servicesValidation(section.trim(), productId, 'Section', true)
  ), [section, isFirstRender]);

  const isBlockError = useMemo(() => (
    servicesValidation(block.trim(), productId, 'Block', true)
  ), [block, isFirstRender]);

  const isUnitError = useMemo(() => (
    servicesValidation(unit.trim(), productId, 'Unit')
  ), [unit, isFirstRender]);

  const isUnableToRequest = !!(
    isDistrictError
    || isSectionError
    || isBlockError
    || isUnitError
    || isFirstRender
  );

  return (
    <div ref={inputsRef}>
      <Parcel>
        <SelectWithLabel
          label="District"
          labelColor="var(--primary-dark-color)"
          placeholder="Please select"
          selectedItem={district}
          setSelectedItem={setDistrict}
          items={districts}
          isError={isButtonPressed && isDistrictError}
          errorMessage="District is required"
          isRequired
        />
        <Input
          label="Section"
          labelColor="var(--primary-dark-color)"
          placeholder="e.g 156"
          value={section}
          onChange={setSection}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isSectionError}
          errorMessage={isSectionError}
          isRequired
          required
        />
        <Input
          label="Block"
          labelColor="var(--primary-dark-color)"
          placeholder="e.g 16"
          value={block}
          onChange={setBlock}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isBlockError}
          errorMessage={isBlockError}
          isRequired
          required
        />
        <Input
          label="Unit"
          labelColor="var(--primary-dark-color)"
          placeholder="e.g 2"
          value={unit}
          onChange={setUnit}
          inputMarginBottom="0"
          isError={isButtonPressed && !!isUnitError}
          errorMessage={isUnitError}
        />
      </Parcel>
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
        text={
          isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Add'
        }
        align="flex-start"
        price="Free"
        onClick={add}
      />
    </div>
  );
};

const Parcel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 0.75rem;
  margin-bottom: 12px;
`;

export default ParcelInputs;
