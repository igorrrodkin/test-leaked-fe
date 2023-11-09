import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import PasswordValidation, {
  IPasswordValidation,
} from '@/components/Auth/PasswordValidation';
import Button from '@/components/Button';
import EditableInput from '@/components/EditableInput';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import {
  changePasswordAction,
  getMeAction,
  updateUserAction, userActions,
} from '@/store/actions/userActions';

import { IChangePasswordBody, IUpdateUserBody, PopupTypes } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useKeyPress from '@/hooks/useKeyPress';
import usePhoneNumber, { isPhoneNumberValid } from '@/hooks/usePhoneNumber';
import useToggle from '@/hooks/useToggle';

import checkEmail from '@/utils/checkEmail';
import { ExistingRegions } from '@/utils/getRegionsData';
import isFormChanged from '@/utils/isFormChanged';
import roleToText from '@/utils/roleToText';

import { AppDispatch } from '@/store';

const regions = Object.values(ExistingRegions).filter((el) => el !== ExistingRegions.ALL);

enum MyDetailsVariant {
  ChangePassword = 'ChangePassword',
  EditUser = 'EditUser',
  Preview = 'Preview',
}

const MyDetails = () => {
  const user = useSelector(selectUser);

  const regionIndex = regions.findIndex(
    (el) => el.toLowerCase() === user!?.state?.toLowerCase(),
  );

  const [name, setName] = useInput(user?.firstName || '');
  const [surname, setSurname] = useInput(user?.lastName || '');
  const [username, setUsername] = useInput(user?.username || '');
  const [email, setEmail] = useInput(user?.email || '');
  const [phone, setPhone] = usePhoneNumber(user?.phone || '');
  const [region, setRegion] = useState<number>(regionIndex);
  const [isLoading, setIsLoading] = useToggle();
  const [isError, setIsError] = useToggle();
  const [variant, setVariant] = useState<MyDetailsVariant>(
    MyDetailsVariant.Preview,
  );
  const [oldPassword, setOldPassword] = useInput();
  const [newPassword, setNewPassword] = useInput();
  const [confirmPassword, setConfirmPassword] = useInput();
  const [isErrorOldPassword, setIsErrorOldPassword] = useToggle();

  const enterPress = useKeyPress('Enter');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setIsError(false);
    setIsLoading(false);
    setIsErrorOldPassword(false);

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [variant]);

  useEffect(() => {
    if (enterPress && variant === MyDetailsVariant.ChangePassword) {
      handleSavePassword();
    }
    if (enterPress && variant === MyDetailsVariant.EditUser) {
      handleSaveUser();
    }
  }, [enterPress]);

  const goBack = () => {
    if (isLoading) return;

    setVariant(MyDetailsVariant.Preview);

    if (user) {
      setName(user.firstName);
      setSurname(user.lastName);
      setUsername(user.username);
      setEmail(user.email);
      setPhone(user.phone);
      setRegion(regionIndex);
    }
  };

  const isEmailError = useMemo(() => !checkEmail(email), [email]);

  const isDisabled = useMemo(
    () => !name
      || !surname
      || !username
      || isEmailError
      || (phone && !isPhoneNumberValid(phone))
      || region === undefined,
    [name, surname, username, isEmailError, phone, region],
  );

  const role = user ? roleToText(user.role) : '';

  const handleSaveUser = async () => {
    if (isLoading) return;

    if (isDisabled) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    const body: IUpdateUserBody = {
      firstName: name,
      lastName: surname,
      phone,
      email,
      state: regions[region!],
    };

    if (!isFormChanged(user!, body)) {
      setIsError(false);
      setIsLoading(false);
      setVariant(MyDetailsVariant.Preview);
      return;
    }

    await dispatch(updateUserAction(user!.id, body));
    await dispatch(getMeAction());

    dispatch(
      userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success Update User',
        additionalText: 'User was updated',
      }),
    );

    setVariant(MyDetailsVariant.Preview);

    setIsLoading(false);
  };

  const handleSavePassword = async () => {
    if (isLoading) return;

    if (isDisabledPassword) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    const body: IChangePasswordBody = {
      oldPassword,
      newPassword,
    };

    try {
      await dispatch(changePasswordAction(body));
      setVariant(MyDetailsVariant.Preview);
    } catch (error) {
      setIsErrorOldPassword(true);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation: IPasswordValidation = useMemo(
    () => ({
      eightCharacters: newPassword.length >= 8,
      upperCaseLetter: /^.*[A-Z].*$/.test(newPassword),
      lowerCaseLetter: /^.*[a-z].*$/.test(newPassword),
      oneDigit: /^.*[0-9].*$/.test(newPassword),
    }),
    [newPassword],
  );

  const isPasswordError = useMemo(
    () => Object.values(passwordValidation).some((el) => el === false),
    [newPassword],
  );

  const isConfirmPassword = useMemo(
    () => confirmPassword === newPassword && !isPasswordError,
    [confirmPassword, newPassword],
  );

  const isDisabledPassword = useMemo(
    () => isPasswordError || !isConfirmPassword || !oldPassword,
    [isPasswordError, isConfirmPassword, oldPassword],
  );

  const emptyFunction = () => {};

  return (
    <Page>
      {(variant === MyDetailsVariant.EditUser
        || variant === MyDetailsVariant.Preview) && (
        <Wrap>
          <H3>My Details</H3>
          <Grid>
            <EditableInput
              isEditMode={variant === MyDetailsVariant.EditUser}
              label="First name"
              value={name}
              setValue={setName}
              placeholder="First name"
              isError={isError && !name}
            />
            <EditableInput
              isEditMode={variant === MyDetailsVariant.EditUser}
              label="Last name"
              value={surname}
              setValue={setSurname}
              placeholder="Last name"
              isError={isError && !surname}
            />
            <EditableInput
              isEditMode
              label="Username"
              value={username}
              setValue={setUsername}
              placeholder="Work Email"
              isError={isError && !username}
              isLocked
            />
            <EditableInput
              isEditMode={variant === MyDetailsVariant.EditUser}
              label="Email"
              value={email}
              setValue={setEmail}
              placeholder="Work Email"
              isError={isError && isEmailError}
            />
            <EditableInput
              isEditMode={variant === MyDetailsVariant.EditUser}
              label="Mobile Phone"
              labelMarginBottom={12}
              placeholder="Phone"
              value={phone}
              setValue={setPhone}
              isError={isError && !isPhoneNumberValid(phone)}
              maxLength={30}
            />
            {region !== undefined ? (
              <EditableInput
                isEditMode={variant === MyDetailsVariant.EditUser}
                label="State"
                placeholder="State"
                value={regions[region] || ''}
                selector={{
                  value: region,
                  values: regions,
                  setValue: setRegion,
                }}
                isError={isError && !region}
              />
            ) : (
              ''
            )}
            <FullWidth>
              <EditableInput
                isEditMode
                label="User Type"
                value={role}
                isLocked
              />
            </FullWidth>
          </Grid>
        </Wrap>
      )}
      {variant === MyDetailsVariant.ChangePassword && (
        <FormWrap>
          <H3>Change Password</H3>
          <Flex>
            <input
              type="text"
              onChange={emptyFunction}
              value={username || email}
              autoComplete="username"
              style={{
                position: 'absolute',
                top: '-10000px',
                width: '0',
                height: '0',
                padding: '0',
                border: '0',
              }}
            />
            <StyledInput
              type="password"
              value={oldPassword}
              onChange={setOldPassword}
              label="Old Password"
              labelMarginBottom={12}
              inputMarginBottom="0"
              placeholder="Input old password"
              autoComplete="current-password webauthn"
              isError={isError && (!oldPassword || isErrorOldPassword)}
            />
            <StyledInput
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              label="New Password"
              labelMarginBottom={12}
              inputMarginBottom="0"
              placeholder="Input new password"
              autoComplete="new-password"
              isError={isError && isPasswordError}
            />
            {isError && (
              <ValidationWrap>
                <PasswordValidation validationConfig={passwordValidation} />
              </ValidationWrap>
            )}
            <StyledInput
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              label="Confirm Password"
              labelMarginBottom={12}
              inputMarginBottom="0"
              placeholder="Input confirmed password"
              autoComplete="new-password"
              isError={isError && !isConfirmPassword}
            />
          </Flex>
        </FormWrap>
      )}
      {variant === MyDetailsVariant.ChangePassword && (
        <Buttons>
          <Button
            isCancel
            disabled={isLoading}
            onClick={goBack}
          >
            Cancel
          </Button>
          <Button style={{ width: '140px' }} onClick={handleSavePassword}>
            {isLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Buttons>
      )}
      {variant === MyDetailsVariant.EditUser && (
        <Buttons>
          <Button
            isCancel
            disabled={isLoading}
            onClick={goBack}
          >
            Cancel
          </Button>
          <Button style={{ width: '140px' }} onClick={handleSaveUser}>
            {isLoading ? (
              <Loader size={24} thickness={2} color="#fff" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Buttons>
      )}
      {variant === MyDetailsVariant.Preview && (
        <Buttons>
          <Button onClick={() => setVariant(MyDetailsVariant.EditUser)}>
            Edit Details
          </Button>
          <Button onClick={() => setVariant(MyDetailsVariant.ChangePassword)}>
            Change Password
          </Button>
        </Buttons>
      )}
    </Page>
  );
};

const ValidationWrap = styled.div`
  ul {
    margin: 0;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 48px;

  ::placeholder {
    font-size: 16px;
  }

  span {
    color: #fff;
  }
`;

const Wrap = styled.div`
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

const FormWrap = styled.form`
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

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 24px;
  height: 100%;
`;

const H3 = styled.h3`
  margin-bottom: 40px;
  font-size: 18px;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 34px;
`;

const Flex = styled.div`
  display: flex;
  row-gap: 34px;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 16px;
`;

const FullWidth = styled.div`
  grid-column: 1 / span 2;
`;

export default MyDetails;
