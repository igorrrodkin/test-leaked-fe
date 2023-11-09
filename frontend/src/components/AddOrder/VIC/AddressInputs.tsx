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

import { orderActions, verifyAction } from '@/store/actions/orderActions';

import { selectCurrentService, selectInitialOrderData, selectMatter } from '@/store/selectors/orderSelectors';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import { getRegionsSelectorData } from '@/utils/getRegionsData';
import servicesValidation from '@/utils/servicesValidation';

const { municipality } = getRegionsSelectorData.VIC;

const locality = ['Suburb', 'Postcode', 'Municipality'];

const AddressInputs: React.FC = () => {
  const [unitNumber, setUnitNumber] = useInput();
  const [streetNumber, setStreetNumber] = useInput();
  const [streetName, setStreetName] = useInput();
  const [selectedLocality, setSelectedLocality] = useState(0);
  const [suburb, setSuburb] = useInput();
  const [postcode, setPostcode] = useInput();
  const [selectedMunicipality, setSelectedMunicipality] = useState(0);
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
      setSuburb(data?.suburb || '');
      setStreetName(data?.street || '');
      setUnitNumber(data?.unitNumber || '');
      setStreetNumber(data?.streetNumber || '');
    }
  }, [data]);

  const search = async () => {
    try {
      toggleIsButtonPressed(true);

      const trimmedUnitNumber = unitNumber.trim();
      const trimmedStreetNumber = streetNumber.trim();
      const trimmedStreetName = streetName.trim();
      const trimmedSuburb = suburb.trim();
      const trimmedPostcode = postcode.trim();

      if (isUnableToRequest || isLoading) return;

      toggleIsLoading(true);

      const orderItemInputs: any = {
        street: trimmedStreetName,
        matterReference: matter,
        ...(trimmedUnitNumber ? { unit: trimmedUnitNumber } : {}),
        ...(trimmedStreetNumber ? { number: trimmedStreetNumber } : {}),
        ...(trimmedSuburb ? { locality: trimmedSuburb } : {}),
        ...(trimmedPostcode ? { postcode: trimmedPostcode } : {}),
        ...(locality[selectedLocality] === 'Municipality' ? { town: municipality[selectedMunicipality] } : {}),
      };

      let description = '';

      if (unitNumber) description += `${unitNumber} / `;
      if (streetNumber) description += `${streetNumber} `;
      description += `${streetName} ${suburb || postcode || municipality[selectedMunicipality]}`;

      dispatch(orderActions.setVerifyTempData({
        identifier: 'HTAV1',
        description,
      }));

      await dispatch(verifyAction({
        matter,
        region: currentService.region,
        input: orderItemInputs,
        identifier: 'HTAV1',
      }));
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    } catch (e: any) {
      toggleIsLoading(false);
      toggleIsButtonPressed(false);
    }
  };

  const selectLocality = (i: number) => {
    setSelectedLocality(i);
    setSuburb('');
    setPostcode('');
    setSelectedMunicipality(0);
  };

  const isStreetNumberError = useMemo(() => (
    servicesValidation(unitNumber.trim(), currentService.productId, 'Unit Number')
  ), [unitNumber, isFirstRender]);

  const isUnitNumberError = useMemo(() => (
    servicesValidation(streetNumber.trim(), currentService.productId, 'Street Number')
  ), [streetNumber, isFirstRender]);

  const isStreetNameError = useMemo(() => (
    servicesValidation(streetName.trim(), currentService.productId, 'Street Name', true)
  ), [streetName, isFirstRender]);

  const isSuburbError = useMemo(() => (
    locality[selectedLocality] === 'Suburb'
      ? servicesValidation(suburb.trim(), currentService.productId, 'Suburb', true)
      : ''
  ), [suburb, selectedLocality, isFirstRender]);

  const isPostcodeError = useMemo(() => (
    locality[selectedLocality] === 'Postcode'
      ? servicesValidation(postcode.trim(), currentService.productId, 'Postcode', true)
      : ''
  ), [postcode, selectedLocality, isFirstRender]);

  const isUnableToRequest = !!(isUnitNumberError
    || isStreetNumberError
    || isStreetNameError
    || isSuburbError
    || isPostcodeError
    || isFirstRender
  );

  return (
    <div ref={inputsRef}>
      <StyledAddressInputs>
        <Input
          value={unitNumber}
          label="Unit number"
          labelColor="var(--primary-dark-color)"
          onChange={setUnitNumber}
          inputMarginBottom="0"
          placeholder="e.g 1"
          isError={isButtonPressed && !!isUnitNumberError}
          errorMessage={isUnitNumberError}
        />
        <Input
          value={streetNumber}
          label="Street number"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetNumber}
          inputMarginBottom="0"
          placeholder="e.g 12"
          isError={isButtonPressed && !!isStreetNumberError}
          errorMessage={isStreetNumberError}
        />
        <Input
          value={streetName}
          label="Street name"
          labelColor="var(--primary-dark-color)"
          onChange={setStreetName}
          inputMarginBottom="0"
          placeholder="e.g Logan"
          isError={isButtonPressed && !!isStreetNameError}
          errorMessage={isStreetNameError}
          isRequired
          required
        />
        <SelectWithLabel
          label="Locality"
          labelColor="var(--primary-dark-color)"
          isRequired
          selectedItem={selectedLocality}
          setSelectedItem={selectLocality}
          items={locality}
        />
        {locality[selectedLocality] === 'Suburb' && (
          <Input
            value={suburb}
            label="Suburb"
            labelColor="var(--primary-dark-color)"
            onChange={setSuburb}
            inputMarginBottom="0"
            placeholder="e.g Canterbury"
            isError={isButtonPressed && !!isSuburbError}
            errorMessage={isSuburbError}
            isRequired
            required
          />
        )}
        {locality[selectedLocality] === 'Postcode' && (
          <Input
            type="text"
            label="Postcode"
            labelColor="var(--primary-dark-color)"
            value={postcode}
            inputMarginBottom="0"
            onChange={setPostcode}
            isError={isButtonPressed && !!isPostcodeError}
            errorMessage={isPostcodeError}
            required
          />
        )}
        {locality[selectedLocality] === 'Municipality' && (
          <SelectWithLabel
            label="Municipality"
            labelColor="var(--primary-dark-color)"
            selectedItem={selectedMunicipality}
            setSelectedItem={setSelectedMunicipality}
            items={municipality}
          />
        )}
      </StyledAddressInputs>
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
        text={isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Browse'}
        price={currentService.priceInclGST}
        align="flex-start"
        alignSelf="flex-end"
        onClick={search}
      />
    </div>
  );
};

const StyledAddressInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.25rem;
  margin-bottom: 0.75rem;
`;

export default AddressInputs;
