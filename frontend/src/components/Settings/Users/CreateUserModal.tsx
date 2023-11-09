import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import base64 from 'base-64';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';
import InfoIcon from '@/assets/icons/InfoIcon';

import PasswordValidation, {
  IPasswordValidation,
} from '@/components/Auth/PasswordValidation';
import UsernameValidation, { IUsernameValidation } from '@/components/Auth/UsernameValidation';
import Background from '@/components/Background';
import Button from '@/components/Button';
import EditableInput from '@/components/EditableInput';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import SettingsOption from '@/components/Settings/Preferences/SettingsOption';

import {
  createUserAction,
  updateUserByAdminAction, userActions,
} from '@/store/actions/userActions';
import { getUsersAction } from '@/store/actions/usersActions';

import {
  ICreatedUser,
  IUpdateUserBody,
  PopupTypes,
  Roles,
} from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectOrganisations } from '@/store/selectors/organisationsSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import useModalWindow from '@/hooks/useModalWindow';
import usePhoneNumber, { isPhoneNumberValid } from '@/hooks/usePhoneNumber';
import useToggle, { HandleToggle } from '@/hooks/useToggle';

import checkEmail from '@/utils/checkEmail';
import isFormChanged from '@/utils/isFormChanged';

import { AppDispatch } from '@/store';

interface Props {
  onClose: HandleToggle;
  user: IOrganisationUser | undefined;
  organisationId: number;
}

const CreateUserModal: React.FC<Props> = ({
  user,
  onClose,
  organisationId,
}) => {
  const [firstName, setFirstName] = useInput(user?.firstName);
  const [lastName, setLastName] = useInput(user?.lastName);
  const [userName, setUserName] = useInput(
    user
      ? user.username
          || `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.replaceAll(
            ' ',
            '_',
          )
      : '',
    true,
  );
  const [email, setEmail] = useInput(user?.email);
  const [phoneNumber, setPhoneNumber] = usePhoneNumber(user?.phone);
  const [isAdmin, setIsAdmin] = useState(
    !!user && user.role !== Roles.CUSTOMER,
  );
  const [newPassword, setNewPassword] = useInput();
  const [confirmPassword, setConfirmPassword] = useInput();
  const [isError, setIsError] = useToggle();
  const [isSaving, setIsSaving] = useToggle();

  const enterPress = useKeyPress('Enter');

  const appUser = useSelector(selectUser);
  const appOrganisations = useSelector(selectOrganisations);
  const dispatch = useDispatch<AppDispatch>();

  useModalWindow();

  const isEmailError = useMemo(() => !checkEmail(email), [email]);

  useEffect(() => {
    if (enterPress) {
      handleSaveUser();
    }
  }, [enterPress]);

  const passwordValidation: IPasswordValidation = useMemo(
    () => ({
      eightCharacters: newPassword.length >= 8,
      upperCaseLetter: /^.*[A-Z].*$/.test(newPassword),
      lowerCaseLetter: /^.*[a-z].*$/.test(newPassword),
      oneDigit: /^.*[0-9].*$/.test(newPassword),
    }),
    [newPassword],
  );

  const usernameValidation: IUsernameValidation = useMemo(
    () => ({
      minFiveCharacters: userName.length >= 5,
      maxFiftyCharacters: userName.length > 0 && userName.length <= 50,
      onlyAcceptedSymbols: /^(\w|-|\.|@)+$/.test(userName),
    }),
    [userName],
  );

  const isPasswordError = useMemo(
    () => {
      if (user) {
        return !!newPassword && Object.values(passwordValidation).some((el) => el === false);
      }
      return Object.values(passwordValidation).some((el) => el === false);
    },
    [newPassword],
  );

  const isUsernameError = useMemo(
    () => {
      if (user) {
        return !!userName && Object.values(usernameValidation).some((el) => el === false);
      }
      return Object.values(usernameValidation).some((el) => el === false);
    },
    [userName],
  );

  const isConfirmPassword = useMemo(
    () => confirmPassword === newPassword,
    [confirmPassword, newPassword],
  );

  const isDisabled = useMemo(
    () => !firstName.trim()
      || !lastName.trim()
      || !userName.trim()
      || isEmailError
      || isPasswordError
      || isUsernameError
      || !isConfirmPassword
      || (!!phoneNumber && !isPhoneNumberValid(phoneNumber)),
    [
      firstName,
      lastName,
      userName,
      isEmailError,
      newPassword,
      confirmPassword,
      isError,
      isPasswordError,
      isUsernameError,
      isConfirmPassword,
      phoneNumber,
    ],
  );

  const handleSaveUser = async () => {
    if (isSaving) return;

    if (isDisabled) {
      setIsError(true);
      return;
    }

    setIsSaving(true);

    let currentOrganisationId: number;

    if (user && appOrganisations) {
      currentOrganisationId = user.organisation; // === org id
    } else {
      if (!appUser || !appOrganisations) {
        console.error('unable to create new user due to lack of data');

        setIsSaving(false);
        return;
      }

      currentOrganisationId = organisationId || appUser.organisations[0].id;
    }

    const passBase64 = confirmPassword.trim() ? base64.encode(confirmPassword.trim()) : '';

    const userRole = isAdmin ? Roles.CUSTOMER_ADMIN : Roles.CUSTOMER;

    try {
      if (user) {
        const editUserBody: IUpdateUserBody = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phoneNumber?.trim(),
          role: userRole,
        };

        if (!isEmailError) {
          editUserBody.email = email;
        }

        if (passBase64) editUserBody.password = passBase64;

        if (!isFormChanged(user, editUserBody)) {
          setIsSaving(false);
          onClose(true);
          return;
        }

        await dispatch(updateUserByAdminAction(user!.id, editUserBody));
        await dispatch(
          getUsersAction(currentOrganisationId || appUser!.organisations[0].id),
        );

        dispatch(
          userActions.setPopup({
            type: PopupTypes.SUCCESS,
            mainText: 'Success Update User',
            additionalText: 'User was updated',
          }),
        );
      } else {
        const newUserBody: ICreatedUser = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: userName.trim(),
          email,
          password: passBase64,
          organisationId: currentOrganisationId,
          role: userRole,
          ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
          state: appUser?.state || 'WA',
        };

        if (phoneNumber.trim()) {
          newUserBody.phone = phoneNumber.trim();
        }

        await dispatch(createUserAction(newUserBody));
        await dispatch(
          getUsersAction(currentOrganisationId || appUser!.organisations[0].id),
        );

        dispatch(
          userActions.setPopup({
            type: PopupTypes.SUCCESS,
            mainText: 'Success Create User',
            additionalText: 'New user was created',
          }),
        );
      }

      setIsSaving(false);
      onClose(true);
    } catch (error) {
      setIsSaving(false);
    }
  };

  const close = () => {
    if (isSaving) return;

    onClose(false);
  };

  const emptyFunction = () => {};

  return (
    <Background close={close}>
      <ModalWindow
        action="#"
        onClick={(evt) => evt.stopPropagation()}
      >
        <Header>
          <PageTitle marginBottom="0">
            {user ? 'Edit User' : 'Add New User'}
          </PageTitle>
          <StyledCloseIcon handler={close} />
        </Header>
        <InputsContainer>
          <MainInputs>
            <Row>
              <Input
                label="First Name"
                labelMarginBottom={12}
                placeholder="First Name"
                value={firstName}
                onChange={setFirstName}
                inputMarginBottom="0"
                isError={!firstName && isError}
                autoComplete="given-name webauthn"
                errorMessage="Invalid first name"
              />
              <Input
                label="Last Name"
                labelMarginBottom={12}
                placeholder="Last Name"
                value={lastName}
                onChange={setLastName}
                inputMarginBottom="0"
                isError={!lastName && isError}
                autoComplete="family-name webauthn"
                errorMessage="Invalid last name"
              />
            </Row>
            {
              user ? (
                <EditableInput
                  isLocked
                  isEditMode
                  label="Username"
                  value={user.username || ''}
                  padding="0 16px"
                  fontSize="12px"
                />
              ) : (
                <>
                  <Input
                    type="text"
                    label="Username"
                    labelMarginBottom={12}
                    placeholder="Username"
                    value={userName}
                    onChange={setUserName}
                    inputMarginBottom="0"
                    isError={isError && isUsernameError}
                    autoComplete="username webauthn"
                  />
                  <ValidationWrap>
                    <UsernameValidation
                      validationConfig={usernameValidation}
                      isPrevInfo={!userName}
                    />
                  </ValidationWrap>
                </>
              )
            }
            <Input
              type="email"
              label="Email"
              labelMarginBottom={12}
              placeholder="Email"
              value={email}
              onChange={setEmail}
              inputMarginBottom="0"
              isError={isError && isEmailError}
              autoComplete="email webauthn"
              errorMessage="Invalid email address"
            />
            <input
              type="text"
              onChange={emptyFunction}
              value={userName || email}
              autoComplete="username"
              tabIndex={-1}
              style={{
                position: 'absolute',
                top: '-10000px',
                width: '0',
                height: '0',
                padding: '0',
                border: '0',
              }}
            />
            <input
              type="password"
              value=""
              onChange={emptyFunction}
              autoComplete="password"
              tabIndex={-1}
              style={{
                position: 'absolute',
                top: '-10000px',
                width: '0',
                height: '0',
                padding: '0',
                border: '0',
              }}
            />
            <Input
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              label={user ? 'New Password' : 'Password'}
              labelMarginBottom={12}
              inputMarginBottom="0"
              placeholder={user ? 'New Password' : 'Password'}
              isError={isError && isPasswordError}
              autoComplete="new-password webauthn"
            />
            <ValidationWrap>
              <PasswordValidation
                validationConfig={passwordValidation}
                isPrevInfo={!newPassword && !confirmPassword}
              />
            </ValidationWrap>
            <Input
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              label={user ? 'Confirm New Password' : 'Confirm Password'}
              labelMarginBottom={12}
              inputMarginBottom="0"
              placeholder={user ? 'Confirm New Password' : 'Confirm Password'}
              isError={isError && !isConfirmPassword}
              autoComplete="new-password"
              errorMessage="Password doesn't match"
            />
            <Input
              type="tel"
              label="Mobile Phone"
              labelMarginBottom={12}
              placeholder="Phone"
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputMarginBottom="0"
              autoComplete="tel webauthn"
              isError={!!phoneNumber && !isPhoneNumberValid(phoneNumber)}
              errorMessage="Invalid phone number"
              maxLength={30}
            />
            <SettingsOption
              isActive={isAdmin}
              setIsActive={() => setIsAdmin(!isAdmin)}
            >
              Make this user an Admin?
              <IconWrap>
                <InfoIcon color="#ACB5BB" />
                <Message>
                  Enabling this option will allow the user to have full
                  administrative and financial control.
                </Message>
              </IconWrap>
            </SettingsOption>
          </MainInputs>
        </InputsContainer>
        <Buttons>
          <Button
            type="button"
            onClick={close}
            disabled={isSaving}
            isCancel
          >
            Cancel
          </Button>
          <Button
            width="94px"
            type="button"
            onClick={handleSaveUser}
          >
            {isSaving ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              <>{user ? 'Update' : 'Add'}</>
            )}
          </Button>
        </Buttons>
      </ModalWindow>
    </Background>
  );
};

const ModalWindow = styled.form`
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
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    background: transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.7);
  }
`;

const MainInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px 18px;

  // for toggle div
  & > div:last-child {
    justify-content: flex-start;
    padding: 0;

    // text color
    & > div {
      display: flex;
      align-items: center;
      color: #111827;
    }
  }
`;

const Row = styled.div`
  display: flex;
  gap: 18px;

  & > label {
    flex: 1 0 auto;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
  padding-left: 32px;
  padding-right: 32px;
`;

const ValidationWrap = styled.div`
  ul {
    margin: 0;
  }
`;

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 0 0 10px;

  position: relative;

  & > p {
    position: absolute;
    top: -25px;
    left: -215px;
    transform: translateY(-50%);
    opacity: 0;
    visibility: hidden;
    z-index: -1;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-size: inherit;
    font-weight: inherit;
    color: #6c7278;
  }

  @media (hover: hover) {
    &:hover {
      & > svg {
        cursor: pointer;
      }

      & > p {
        display: block;
        opacity: 1;
        visibility: visible;
        z-index: 1;
        padding: 5px 10px;
        background: #ffffff;
        border-radius: 2px;
        box-shadow: 4px 4px 12px rgba(68, 68, 79, 0.12);
      }
    }
  }
`;

const Message = styled.p``;

export default CreateUserModal;
