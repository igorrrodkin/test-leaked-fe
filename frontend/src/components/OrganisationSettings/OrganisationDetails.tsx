import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/Button';
import EditableInput from '@/components/EditableInput';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import SelectWithLabel from '@/components/SelectWithLabel';

import { updateOrganisation } from '@/store/actions/organisationsActions';

import {
  IFullOrganisation,
  IUpdateOrganisationRequest,
} from '@/store/reducers/organisations';
import { Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import usePhoneNumber, { isPhoneNumberValid } from '@/hooks/usePhoneNumber';
import useToggle from '@/hooks/useToggle';

import checkEmail from '@/utils/checkEmail';
import { ExistingRegions } from '@/utils/getRegionsData';
import isFormChanged from '@/utils/isFormChanged';

import { AppDispatch } from '@/store';

export enum PaymentTypes {
  AUTO = 'Automatic Payments',
  MANUAL = 'Manual Payments',
}

export enum InvoiceFrequency {
  Monthly = 'Monthly',
}

export enum PaymentTerms {
  '7 days' = '7_days',
  '14 days' = '14_days',
  '30 days' = '30_days',
}

interface Props {
  organisationId: number;
  organisation: IFullOrganisation;
  isUserSettings?: boolean;
}

const states = Object.values(ExistingRegions).filter((el) => el !== ExistingRegions.ALL);

const OrganisationDetails: React.FC<Props> = ({
  organisationId,
  organisation,
  isUserSettings = false,
}) => {
  const appUser = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useInput(organisation.name?.trim() || '');
  const [primaryContact, setPrimaryContact] = useInput(
    organisation.primaryContact?.trim() || '',
  );
  const [email, setEmail] = useInput(organisation.email?.trim() || '');
  const [phone, setPhone] = usePhoneNumber(organisation.phone?.trim());
  const [abn, setAbn] = useInput(organisation.abn?.trim() || '');

  const types = Object.values(PaymentTypes).findIndex(
    (type) => organisation.paymentType === type,
  );
  const [paymentType, setPaymentType] = useState(
    organisation.paymentType ? (types === -1 ? undefined : types) : undefined,
  );

  const frequency = Object.values(InvoiceFrequency).findIndex(
    (type) => organisation.invoiceFrequency === type,
  );
  const [invoiceFrequency, setInvoiceFrequency] = useState(
    organisation.invoiceFrequency ? (frequency === -1 ? undefined : frequency) : undefined,
  );

  const terms = Object.values(PaymentTerms).findIndex(
    (type) => organisation.paymentTerms === type,
  );
  const [paymentTerms, setPaymentTerms] = useState(
    organisation.paymentTerms ? (terms === -1 ? undefined : terms) : undefined,
  );

  const [paymentThreshold, setPaymentThreshold] = useInput(
    (+organisation.paymentThreshold / 100).toString()?.trim() || '',
  );

  const [accountLimit, setAccountLimit] = useInput(
    (+organisation.accountLimit / 100).toString()?.trim() || '',
  );

  const [financeEmail, setFinanceEmail] = useInput(
    organisation.financeEmail?.trim() || '',
  );

  const [flatUnit, setFlatUnit] = useInput(organisation.flatUnit?.trim() || '');
  const [number, setNumber] = useInput(organisation.houseNumber?.trim() || '');
  const [street, setStreet] = useInput(organisation.street?.trim() || '');
  const [suburb, setSuburb] = useInput(organisation.suburb?.trim() || '');
  const [state, setState] = useState<number | undefined>(
    organisation.state
      ? states.findIndex(
        (existingRegion) => organisation.state === existingRegion,
      )
      : undefined,
  );
  const [postcode, setPostcode] = useInput(organisation.postcode?.trim() || '');

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useToggle(false);
  const [isError, setIsError] = useToggle();

  const enterPress = useKeyPress('Enter');

  const isEmailError = useMemo(() => !checkEmail(email), [email]);
  const isFinanceEmailError = useMemo(
    () => !checkEmail(financeEmail),
    [financeEmail],
  );

  const isPaymentThreshold = useMemo(
    () => +paymentThreshold < 1 || +paymentThreshold > 1000,
    [paymentThreshold],
  );

  const isAccountLimit = useMemo(
    () => +accountLimit < 1 || +accountLimit > 10000000,
    [accountLimit],
  );

  const isDisabled = useMemo(
    () => isEmailError
      || isFinanceEmailError
      || abn.length !== 14
      || !name
      || !primaryContact
      || !isPhoneNumberValid(phone)
      || !Object.values(PaymentTypes)[paymentType!]
      || !Object.values(InvoiceFrequency)[invoiceFrequency!]
      || !Object.values(PaymentTerms)[paymentTerms!]
      || isPaymentThreshold
      || isAccountLimit
      || !states[state!],
    [
      isEmailError,
      isFinanceEmailError,
      name,
      primaryContact,
      financeEmail,
      phone,
      paymentType,
      invoiceFrequency,
      paymentTerms,
      isPaymentThreshold,
      isAccountLimit,
      flatUnit,
      number,
      street,
      suburb,
      state,
      postcode,
      suburb,
      abn,
    ],
  );

  useEffect(() => {
    if (enterPress) {
      handleUpdateOrganisation();
    }
  }, [enterPress]);

  const handleUpdateOrganisation = async () => {
    if (isLoading) return;

    if (isDisabled) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    const body: IUpdateOrganisationRequest = {
      abn: abn?.trim(),
      name: name?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      financeEmail: financeEmail?.trim(),
      paymentType: Object.values(PaymentTypes)[paymentType!],
      invoiceFrequency: Object.values(InvoiceFrequency)[invoiceFrequency!],
      paymentTerms: Object.values(PaymentTerms)[paymentTerms!],
      ...(paymentThreshold ? { paymentThreshold: +paymentThreshold * 100 } : {}),
      ...(accountLimit ? { accountLimit: +accountLimit * 100 } : {}),
      flatUnit: flatUnit?.trim(),
      houseNumber: number?.trim(),
      street: street?.trim(),
      suburb: suburb?.trim(),
      postcode: postcode?.trim(),
      primaryContact: primaryContact?.trim(),
      state: states[state!],
    };

    if (!isFormChanged(organisation, body)) {
      setIsEdit(false);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(updateOrganisation(organisationId, body, isUserSettings));

      setIsLoading(false);
      handleCloseEditMode();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleOpenEditMode = () => {
    setIsEdit(true);
    setIsError(false);
  };

  const handleCloseEditMode = (isCancel = false) => {
    if (isLoading) return;

    setIsEdit(false);
    setIsError(false);

    if (isCancel) {
      setName(organisation.name || '');
      setPrimaryContact(organisation.primaryContact || '');
      setEmail(organisation.email || '');
      setPhone(organisation.phone || '');
      setPaymentType(organisation.paymentType ? (types === -1 ? undefined : types) : undefined);
      setInvoiceFrequency(organisation.invoiceFrequency ? (frequency === -1 ? undefined : frequency) : undefined);
      setPaymentTerms(organisation.paymentTerms ? (terms === -1 ? undefined : terms) : undefined);
      setPaymentThreshold((+organisation.paymentThreshold / 100).toString() || '');
      setAccountLimit((+organisation.accountLimit / 100).toString() || '');
      setFinanceEmail(organisation.financeEmail || '');
      setAbn(organisation.abn || '');
      setFlatUnit(organisation.flatUnit || '');
      setNumber(organisation.houseNumber || '');
      setStreet(organisation.street || '');
      setSuburb(organisation.suburb || '');
      setState(organisation.state
        ? states.findIndex(
          (existingRegion) => organisation.state === existingRegion,
        )
        : undefined);
      setPostcode(organisation.postcode || '');
    }
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');

    setPostcode(result);
  };

  return (
    <OrganisationDetailsStyled>
      <OrganisationWrap>
        <Title>Organisation</Title>
        <InputsWrap>
          <Wrap>
            <Input
              label="Name"
              labelMarginBottom={12}
              placeholder="Company"
              value={name}
              onChange={setName}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && !name}
            />
            <Input
              label="Primary Contact"
              labelMarginBottom={12}
              placeholder="Primary Contact"
              value={primaryContact}
              onChange={setPrimaryContact}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && !primaryContact}
            />
          </Wrap>
          <Wrap>
            <Input
              label="Email"
              labelMarginBottom={12}
              placeholder="Email"
              type="email"
              value={email}
              onChange={setEmail}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && isEmailError}
            />
            <Input
              label="Phone"
              labelMarginBottom={12}
              placeholder="Phone"
              value={phone}
              onChange={setPhone}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && !isPhoneNumberValid(phone)}
              maxLength={30}
            />
          </Wrap>
          <Wrap>
            <Input
              label="Finance Email"
              labelMarginBottom={12}
              placeholder="Finance Email"
              type="email"
              value={financeEmail}
              onChange={setFinanceEmail}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && isFinanceEmailError}
            />
            <Input
              label="ABN"
              labelMarginBottom={12}
              placeholder="ABN"
              type="text"
              value={abn}
              onChange={setAbn}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
              isError={isError && abn.length !== 14}
              mask="99 999 999 999"
            />
          </Wrap>
          <Wrap>
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <SelectWithLabel
                label="Payment Type"
                labelMarginBottom={12}
                selectedItem={paymentType}
                setSelectedItem={setPaymentType}
                items={Object.values(PaymentTypes)}
                placeholder="System Default"
                disabled={!isEdit}
                padding="16px 24px"
                height="48px"
                fontSize="16px"
                isError={isError && paymentType === undefined}
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Payment Type"
                value={
                  organisation.paymentType
                    ? organisation.paymentType
                    : 'Payment Type'
                }
                placeholder="System Default"
              />
            )}
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <Input
                label="Payment Threshold"
                labelMarginBottom={12}
                placeholder="System Default (100)"
                value={paymentThreshold}
                onChange={setPaymentThreshold}
                inputPadding="16px 24px"
                inputHeight="48px"
                inputFontSize="16px"
                inputMarginBottom="0"
                width="100%"
                disabled={!isEdit}
                isError={isError && isPaymentThreshold}
                type="number"
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Payment Threshold"
                value={paymentThreshold}
                placeholder="System Default (100)"
              />
            )}
          </Wrap>
          <Wrap>
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <Input
                label="Account Limit"
                labelMarginBottom={12}
                placeholder="System Default (1000)"
                value={accountLimit}
                onChange={setAccountLimit}
                inputPadding="16px 24px"
                inputHeight="48px"
                inputFontSize="16px"
                inputMarginBottom="0"
                width="100%"
                disabled={!isEdit}
                isError={isError && isAccountLimit}
                type="number"
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Account Limit"
                value={accountLimit}
                placeholder="System Default (1000)"
              />
            )}
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <SelectWithLabel
                label="Invoice Frequency"
                labelMarginBottom={12}
                selectedItem={invoiceFrequency}
                setSelectedItem={setInvoiceFrequency}
                items={Object.values(InvoiceFrequency)}
                placeholder="System Default"
                disabled={!isEdit}
                padding="16px 24px"
                height="48px"
                fontSize="16px"
                isError={isError && invoiceFrequency === undefined}
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Invoice Frequency"
                value={
                  organisation.invoiceFrequency
                    ? organisation.invoiceFrequency
                    : 'Invoice Frequency'
                }
                placeholder="System Default"
              />
            )}
          </Wrap>
          <Wrap>
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <SelectWithLabel
                label="Payment Terms"
                labelMarginBottom={12}
                selectedItem={paymentTerms}
                setSelectedItem={setPaymentTerms}
                items={Object.keys(PaymentTerms)}
                placeholder="System Default"
                disabled={!isEdit}
                padding="16px 24px"
                height="48px"
                fontSize="16px"
                isError={isError && paymentTerms === undefined}
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Payment Terms"
                value={
                  organisation.paymentTerms && paymentTerms !== undefined
                    ? Object.keys(PaymentTerms)[paymentTerms]
                    : 'Payment Terms'
                }
                placeholder="System Default"
              />
            )}
          </Wrap>
        </InputsWrap>
      </OrganisationWrap>
      <Line />
      <OrganisationWrap>
        <Title>Address</Title>
        <InputsWrap>
          <Wrap>
            <Input
              label="Flat / Unit"
              labelMarginBottom={12}
              value={flatUnit}
              onChange={setFlatUnit}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
            />
            <Input
              label="Number"
              labelMarginBottom={12}
              value={number}
              onChange={setNumber}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
            />
          </Wrap>
          <Wrap>
            <Input
              label="Street"
              labelMarginBottom={12}
              value={street}
              onChange={setStreet}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
            />
            <Input
              label="Suburb"
              labelMarginBottom={12}
              value={suburb}
              onChange={setSuburb}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
            />
          </Wrap>
          <Wrap>
            <SelectWithLabel
              label="State"
              labelMarginBottom={12}
              selectedItem={state}
              setSelectedItem={setState}
              items={states}
              placeholder="State"
              disabled={!isEdit}
              padding="16px 24px"
              height="48px"
              fontSize="16px"
              openToTop
              isError={isError && state === undefined}
            />
            <Input
              label="Postcode"
              labelMarginBottom={12}
              value={postcode}
              onChange={handlePostcodeChange}
              inputPadding="16px 24px"
              inputHeight="48px"
              inputFontSize="16px"
              inputMarginBottom="0"
              width="100%"
              disabled={!isEdit}
            />
          </Wrap>
        </InputsWrap>
      </OrganisationWrap>
      {isEdit ? (
        <ButtonsWrapper>
          <Button
            disabled={isLoading}
            onClick={() => handleCloseEditMode(true)}
            isCancel
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateOrganisation} style={{ width: '140px' }}>
            {isLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </ButtonsWrapper>
      ) : (
        <ButtonsWrapper>
          <Button onClick={handleOpenEditMode}>Edit Details</Button>
        </ButtonsWrapper>
      )}
    </OrganisationDetailsStyled>
  );
};

const Line = styled.div`
  border-bottom: 1px solid #1a1c1e;
  opacity: 0.16;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  column-gap: 16px;
  margin-top: auto;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 34px;

  label {
    width: 100%;
  }

  // EditableInput styles
  & .locked {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #6c7278;
    row-gap: 12px;

    & > span {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }

    & > div {
      padding: 16px 24px;
      border: 1px solid rgba(35, 35, 35, 0.16);
      border-radius: 4px;
    }
  }
`;

const InputsWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: #111827;
`;

const OrganisationWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;

const OrganisationDetailsStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  height: 100%;
`;

export default OrganisationDetails;
