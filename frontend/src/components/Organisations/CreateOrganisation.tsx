import React, {
  useEffect,
  useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';

import Background from '@/components/Background';
import Button from '@/components/Button';
import EditableInput from '@/components/EditableInput';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { PaymentTypes } from '@/components/OrganisationSettings/OrganisationDetails';
import PageTitle from '@/components/PageTitle';
import Select from '@/components/Select';

import {
  createOrganisationAction,
  organisationsActions,
} from '@/store/actions/organisationsActions';
import { userActions } from '@/store/actions/userActions';

import { ICreateOrganisation } from '@/store/reducers/organisations';
import { PopupTypes, Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';
import usePhoneNumber, { isPhoneNumberValid } from '@/hooks/usePhoneNumber';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import checkEmail from '@/utils/checkEmail';
import { ExistingRegions } from '@/utils/getRegionsData';

interface Props {
  close: HandleToggle;
}

const states = Object.values(ExistingRegions).filter((el) => el !== ExistingRegions.ALL);

const CreateOrganisation: React.FC<Props> = ({ close }) => {
  const [name, setName] = useInput();
  const [primaryContact, setPrimaryContact] = useInput('');
  const [email, setEmail] = useInput();
  const [phoneNumber, setPhoneNumber] = usePhoneNumber();
  const [financeEmail, setFinanceEmail] = useInput();
  const [paymentType, setPaymentType] = useState(0);
  const [paymentThreshold, setPaymentThreshold] = useInput('');
  const [unit, setUnit] = useInput();
  const [number, setNumber] = useInput();
  const [street, setStreet] = useInput();
  const [suburb, setSuburb] = useInput();
  const [state, setState] = useState(0);
  const [postcode, setPostcode] = useInput();
  const [isError, setIsError] = useToggle();

  const enterPress = useKeyPress('Enter');

  const appUser = useSelector(selectUser);

  const [isLoading, toggleIsLoading] = useToggle();
  const dispatch = useDispatch<any>();

  useModalWindow();

  const isEmailError = useMemo(() => !checkEmail(email), [email]);
  const isFinanceEmailError = useMemo(
    () => !checkEmail(financeEmail),
    [financeEmail],
  );
  const isPaymentThreshold = useMemo(
    () => (+paymentThreshold < 1 || +paymentThreshold > 1000),
    [paymentThreshold],
  );

  const isDisabled = useMemo(
    () => isEmailError
      || isFinanceEmailError
      || !name
      || !primaryContact
      || !isPhoneNumberValid(phoneNumber)
      || !Object.values(PaymentTypes)[paymentType!]
      || isPaymentThreshold
      || !number
      || !street
      || !suburb
      || !states[state!]
      || !postcode
      || !suburb,
    [
      isEmailError,
      isFinanceEmailError,
      name,
      primaryContact,
      financeEmail,
      phoneNumber,
      paymentType,
      isPaymentThreshold,
      unit,
      number,
      street,
      suburb,
      state,
      postcode,
      suburb,
    ],
  );

  useEffect(() => {
    if (enterPress) {
      create();
    }
  }, [enterPress]);

  const create = async () => {
    if (isDisabled) {
      setIsError(true);
      return;
    }

    try {
      const body: ICreateOrganisation = {
        abn: '',
        name: name.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        financeEmail: financeEmail.trim(),
        paymentType: Object.values(PaymentTypes)[paymentType!],
        ...(paymentThreshold ? { paymentThreshold: +paymentThreshold * 100 } : {}),
        flatUnit: unit.trim(),
        houseNumber: number.trim(),
        street: street.trim(),
        suburb: suburb.trim(),
        postcode: postcode.trim(),
        primaryContact: primaryContact.trim(),
        state: states[state!],
      };

      dispatch(organisationsActions.setIsLoading(true));
      toggleIsLoading(true);

      await dispatch(createOrganisationAction(body));

      dispatch(organisationsActions.setIsLoading(false));
      toggleIsLoading(false);

      close(false);

      dispatch(
        userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success Create Organisation',
          additionalText: `New ${body.name} organisation was created`,
        }),
      );
    } catch (error: any) {
      dispatch(organisationsActions.setIsLoading(false));
      toggleIsLoading(false);
    }
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');

    setPostcode(result);
  };

  return (
    <Background close={close}>
      <ModalWindow onClick={(evt) => evt.stopPropagation()}>
        <Header>
          <PageTitle marginBottom="0">Add New Organisation</PageTitle>
          <StyledCloseIcon handler={close} />
        </Header>
        <InputsContainer>
          <MainInputs>
            <Input
              label="Organisation Name"
              labelMarginBottom={12}
              placeholder="Name"
              value={name}
              onChange={setName}
              inputMarginBottom="0"
              isError={isError && !name}
            />
            <Input
              label="Primary Contact"
              labelMarginBottom={12}
              placeholder="Primary Contact"
              value={primaryContact}
              onChange={setPrimaryContact}
              inputMarginBottom="0"
              isError={isError && !primaryContact}
            />
            <Input
              label="Email"
              labelMarginBottom={12}
              placeholder="Email"
              value={email}
              onChange={setEmail}
              inputMarginBottom="0"
              isError={isError && isEmailError}
            />
            <Input
              label="Phone Number"
              labelMarginBottom={12}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputMarginBottom="0"
              isError={isError && !isPhoneNumberValid(phoneNumber)}
              maxLength={30}
            />
            <Wrap>
              <Input
                label="Finance Email"
                labelMarginBottom={12}
                placeholder="Email"
                value={financeEmail}
                onChange={setFinanceEmail}
                inputMarginBottom="0"
                isError={isError && isFinanceEmailError}
              />
            </Wrap>
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <Label isError={isError && paymentType === undefined}>
                Payment Type
                <Select
                  selectedItem={paymentType}
                  setSelectedItem={setPaymentType}
                  items={Object.values(PaymentTypes)}
                  placeholder="Payment Type"
                />
              </Label>
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Payment Type"
                value={Object.values(PaymentTypes)[paymentType!]}
                placeholder="Payment Type"
              />
            )}
            {appUser?.role === Roles.SYSTEM_ADMIN ? (
              <Input
                label="Payment Threshold"
                labelMarginBottom={12}
                placeholder="Payment Threshold"
                value={paymentThreshold}
                onChange={setPaymentThreshold}
                isError={isError && isPaymentThreshold}
                type="number"
              />
            ) : (
              <EditableInput
                isEditMode
                isLocked
                label="Payment Threshold"
                value={paymentThreshold}
                placeholder="Payment Threshold"
              />
            )}
          </MainInputs>
          <SubTitle>Address</SubTitle>
          <AddressInputs>
            <Input
              label="Flat / Unit"
              labelMarginBottom={12}
              placeholder="Flat / Unit"
              value={unit}
              onChange={setUnit}
              inputMarginBottom="0"
            />
            <Input
              label="Number"
              labelMarginBottom={12}
              placeholder="Number"
              value={number}
              onChange={setNumber}
              inputMarginBottom="0"
              isError={isError && !number}
            />
            <Input
              label="Street"
              labelMarginBottom={12}
              placeholder="Street"
              value={street}
              onChange={setStreet}
              inputMarginBottom="0"
              isError={isError && !street}
            />
            <Input
              label="Suburb"
              labelMarginBottom={12}
              placeholder="Suburb"
              value={suburb}
              onChange={setSuburb}
              inputMarginBottom="0"
              isError={isError && !suburb}
            />
            <Label isError={isError && state === undefined}>
              <span>State</span>
              <Select
                selectedItem={state}
                setSelectedItem={setState}
                items={states}
                openToTop
              />
            </Label>
            <Input
              label="Postcode"
              labelMarginBottom={12}
              placeholder="Postcode"
              value={postcode}
              onChange={handlePostcodeChange}
              inputMarginBottom="0"
              isError={isError && !postcode}
            />
          </AddressInputs>
        </InputsContainer>
        <Buttons>
          <Button onClick={close} isCancel>
            Cancel
          </Button>
          <Button onClick={create}>
            {isLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Create'
            )}
          </Button>
        </Buttons>
      </ModalWindow>
    </Background>
  );
};

const ModalWindow = styled.div`
  display: grid;
  grid-template-rows: auto minmax(50px, 1fr) auto;
  padding: 32px 0;
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  min-height: 600px;
  border-radius: 16px;
  background-color: #fff;
  cursor: default;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 10px;
  margin-bottom: 32px;
  padding-left: 32px;
  padding-right: 32px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const InputsContainer = styled.div`
  padding-left: 32px;
  padding-right: 32px;

  margin-bottom: 32px;
  overflow-y: auto;
  width: calc(100% - 4px);
  scrollbar-color: rgba(163, 163, 163, 0.7);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(163, 163, 163, 0.7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const MainInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-end: 2;
  grid-gap: 32px 18px;
  margin-bottom: 32px;
`;

const Label = styled.label<{ isError?: boolean }>`
  display: flex;
  flex-direction: column;
  grid-gap: 12px;

  ${({ isError }) => isError
    && css`
      color: var(--primary-red-color);

      button {
        border: 1px solid #ff3333;
      }
    `}

  span {
    color: #6c7278;
    font-weight: 500;
    white-space: nowrap;
  }

  :last-child {
    grid-column: span 2;
  }
`;

const SubTitle = styled.h4`
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 500;
`;

const AddressInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 32px 18px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding-left: 32px;
  padding-right: 32px;
`;

const Wrap = styled.div`
  grid-column: 1 / span 2;
`;

export default CreateOrganisation;
