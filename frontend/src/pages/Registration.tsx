import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ISignUpBody } from '@/api/mainApi';

import Logo from '@/assets/logo-white.png';

import PasswordValidation, {
  IPasswordValidation,
} from '@/components/Auth/PasswordValidation';
import UsernameValidation, { IUsernameValidation } from '@/components/Auth/UsernameValidation';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Select from '@/components/Select';

import { registerAction } from '@/store/actions/userActions';

import useInput from '@/hooks/useInput';
import usePhoneNumber, { isPhoneNumberValid } from '@/hooks/usePhoneNumber';
import useToggle from '@/hooks/useToggle';

import checkEmail from '@/utils/checkEmail';
import { ExistingRegions } from '@/utils/getRegionsData';

import { AppDispatch } from '@/store';

const states = Object.values(ExistingRegions).filter((el) => el !== ExistingRegions.ALL);

const businesses = [
  'Law Firm',
  'Conveyancing',
  'Accounting',
  'Real Estate',
  'Corporate',
  'Government',
  'Banking & Finance',
  'Other',
];

const Auth = () => {
  const [email, setEmail] = useInput();
  const [username, setUsername] = useInput();
  const [password, setPassword] = useInput();
  const [confirmPassword, setConfirmPassword] = useInput();
  const [firstName, setFirstName] = useInput();
  const [lastName, setLastName] = useInput();
  const [phone, setPhone] = usePhoneNumber();
  const [company, setCompany] = useInput();
  const [state, setState] = useState<number>();
  const [abn, setAbn] = useInput();
  const [business, setBusiness] = useState<number>();
  const [isChecked, setIsChecked] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const [isError, setIsError] = useToggle();
  const [useEmailAsUsername, toggleUseEmailAsUsername] = useToggle(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const sendData = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isDisabled) {
      setIsError(true);
      return;
    }

    const body: ISignUpBody = {
      firstName,
      lastName,
      email,
      password,
      phone,
      organisation: company,
      state: states[state!],
      abn,
      typeOfBusiness: businesses[business!],
      username: useEmailAsUsername ? email : username,
    };

    try {
      toggleIsLoading(true);
      await dispatch(registerAction(body));
      navigate('/login-now');
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const isEmailError = useMemo(() => !checkEmail(email), [email]);

  const passwordValidation: IPasswordValidation = useMemo(
    () => ({
      eightCharacters: password.length >= 8,
      upperCaseLetter: /^.*[A-Z].*$/.test(password),
      lowerCaseLetter: /^.*[a-z].*$/.test(password),
      oneDigit: /^.*[0-9].*$/.test(password),
    }),
    [password],
  );

  const usernameValidation: IUsernameValidation = useMemo(
    () => ({
      minFiveCharacters: username.length >= 5,
      maxFiftyCharacters: username.length > 0 && username.length <= 50,
      onlyAcceptedSymbols: /^(\w|-|\.|@)+$/.test(username),
    }),
    [username],
  );

  const isPasswordError = useMemo(
    () => Object.values(passwordValidation).some((el) => el === false),
    [password],
  );

  const isConfirmPassword = useMemo(
    () => confirmPassword === password && !isPasswordError,
    [confirmPassword, password],
  );

  const isUsernameError = useMemo(
    () => Object.values(usernameValidation).some((el) => el === false),
    [username],
  );

  const isDisabled = useMemo(
    () => isEmailError
      || isPasswordError
      || !isConfirmPassword
      || (useEmailAsUsername ? isEmailError : isUsernameError)
      || !firstName
      || !lastName
      || !isPhoneNumberValid(phone)
      || !company
      || state === undefined
      || abn.length !== 14
      || business === undefined
      || !isChecked,
    [
      isEmailError,
      isPasswordError,
      isConfirmPassword,
      isUsernameError,
      firstName,
      lastName,
      phone,
      company,
      state,
      abn,
      business,
      isChecked,
      useEmailAsUsername,
    ],
  );

  const emptyFunction = () => {};

  return (
    <StyledAuth>
      <LeftSide>
        <LeftSideTextBlock>
          <LogoImage src={Logo} alt="Alts logo" />
          <Title>
            Join the thousands of firms who
            {' '}
            <span>automate their work</span>
            {' '}
            using ALTS Corp
          </Title>
          <List>
            <ListItem>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.36997 9.50993C2.28997 9.79993 2.29997 15.7099 6.36997 15.9999H16.03C17.2 16.0099 18.33 15.5699 19.2 14.7799C22.06 12.2799 20.53 7.27991 16.76 6.79991C15.41 -1.34009 3.61998 1.74993 6.40998 9.50993"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16V19"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 23C13.1046 23 14 22.1046 14 21C14 19.8954 13.1046 19 12 19C10.8954 19 10 19.8954 10 21C10 22.1046 10.8954 23 12 23Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 21H14"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 21H6"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ALTS Corp solutions are cloud-based, meaning you can access your
              matters anywhere, anytime.
            </ListItem>
            <ListItem>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4399 19.05L15.9599 20.57L18.9999 17.53"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.4501 10.79 7.5601 8.84 7.5601 6.44C7.5501 3.99 9.5401 2 11.9901 2C14.4401 2 16.4301 3.99 16.4301 6.44C16.4301 8.84 14.5301 10.79 12.1601 10.87Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.99 21.8101C10.17 21.8101 8.36004 21.3501 6.98004 20.4301C4.56004 18.8101 4.56004 16.1701 6.98004 14.5601C9.73004 12.7201 14.24 12.7201 16.99 14.5601"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Your dedicated account manager can provide you with complimentary
              training whenever you need.
            </ListItem>
            <ListItem>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 11C20 15.97 15.97 20 11 20C6.03 20 2 15.97 2 11C2 6.03 6.03 2 11 2"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9299 20.6898C19.4599 22.2898 20.6699 22.4498 21.5999 21.0498C22.4499 19.7698 21.8899 18.7198 20.3499 18.7198C19.2099 18.7098 18.5699 19.5998 18.9299 20.6898Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 5H20"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 8H17"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Find and order your choice of over 4500 searches and services to
              best meet your client’s needs.
            </ListItem>
            <ListItem>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.32 10H4.69002C3.21002 10 2.01001 8.79002 2.01001 7.32002V4.69002C2.01001 3.21002 3.22002 2.01001 4.69002 2.01001H19.32C20.8 2.01001 22 3.22002 22 4.69002V7.32002C22 8.79002 20.79 10 19.32 10Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.32 22H4.69002C3.21002 22 2.01001 20.79 2.01001 19.32V16.69C2.01001 15.21 3.22002 14.01 4.69002 14.01H19.32C20.8 14.01 22 15.22 22 16.69V19.32C22 20.79 20.79 22 19.32 22Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5V7"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 5V7"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 17V19"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17V19"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 6H18"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 18H18"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ALTS Corp integrates with over 30 Practice Management Systems,
              streamlining your matters.
            </ListItem>
            <ListItem>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
                <path
                  d="M20 4H15.2M20 4V8.8V4Z"
                  stroke="#6C7278"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              We take 35 seconds to answer your call, and 84% of your queries
              will be resolved on first contact.
            </ListItem>
          </List>
        </LeftSideTextBlock>
      </LeftSide>
      <SideWrapper>
        <FormWrapper>
          <AuthWrapper onSubmit={sendData}>
            <PageTitle>Register your account</PageTitle>
            <InputsWrapper
              style={{ marginBottom: '32px' }}
            >
              <StyledInput
                type="text"
                value={firstName}
                onChange={setFirstName}
                label="First name"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Your first name"
                autoComplete="given-name"
                isError={isError && !firstName}
              />
              <StyledInput
                type="text"
                value={lastName}
                onChange={setLastName}
                label="Last name"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Your last name"
                autoComplete="family-name"
                isError={isError && !lastName}
              />
            </InputsWrapper>
            <InputWrapper>
              <Input
                type="tel"
                value={phone}
                onChange={setPhone}
                label="Phone"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Your phone number"
                autoComplete="tel"
                isError={isError && !isPhoneNumberValid(phone)}
                maxLength={30}
              />
            </InputWrapper>
            <InputsWrapper
              style={{ marginBottom: '32px' }}
            >
              <StyledInput
                type="text"
                value={company}
                onChange={setCompany}
                label="Company"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Company"
                autoComplete="organization"
                isError={isError && !company}
              />
              <Label isError={isError && state === undefined}>
                State
                <Select
                  selectedItem={state}
                  setSelectedItem={setState}
                  items={states}
                  placeholder="State"
                />
              </Label>
              <StyledInput
                type="text"
                value={abn}
                onChange={setAbn}
                label="ABN"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="ABN"
                isError={isError && abn.length !== 14}
                mask="99 999 999 999"
              />
              <Label isError={isError && business === undefined}>
                Type of Business
                <Select
                  selectedItem={business}
                  setSelectedItem={setBusiness}
                  items={businesses}
                  placeholder="Business"
                />
              </Label>
            </InputsWrapper>
            <InputWrapper>
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                name={useEmailAsUsername ? 'username' : 'email'}
                label="Work Email"
                labelMarginBottom={12}
                placeholder="Input your email address"
                autoComplete={useEmailAsUsername ? 'username' : 'email'}
                isError={isError && isEmailError}
              />
              <Wrap>
                <Checkbox
                  type="checkbox"
                  checked={useEmailAsUsername}
                  onChange={({ target }) => {
                    setUsername('');
                    toggleUseEmailAsUsername(target.checked);
                  }}
                />
                <Text>
                  Use email address as username
                </Text>
              </Wrap>
            </InputWrapper>
            {!useEmailAsUsername && (
              <InputWrapper>
                <Input
                  type="text"
                  value={username}
                  onChange={setUsername}
                  name="username"
                  label="Username"
                  inputMarginBottom="0"
                  labelMarginBottom={12}
                  placeholder="Input your username"
                  autoComplete="username"
                  isError={isError && isUsernameError}
                />
                {isError && (
                  <ValidationWrap>
                    <UsernameValidation
                      validationConfig={usernameValidation}
                    />
                  </ValidationWrap>
                )}
              </InputWrapper>
            )}
            <input
              onChange={emptyFunction}
              type="text"
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
            <InputsWrapper>
              <StyledInput
                type="password"
                value={password}
                onChange={setPassword}
                label="Password"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Input your password"
                autoComplete="new-password"
                isError={isError && isPasswordError}
              />
              <StyledInput
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                label="Confirm Password"
                labelMarginBottom={12}
                inputMarginBottom="0"
                placeholder="Input your password"
                autoComplete="new-password"
                isError={isError && !isConfirmPassword}
              />
            </InputsWrapper>
            {isError && (
              <ValidationWrap>
                <PasswordValidation validationConfig={passwordValidation} />
              </ValidationWrap>
            )}
            <Terms>
              <TermsTitle>Terms of Service</TermsTitle>
              <Wrap>
                <Checkbox
                  type="checkbox"
                  checked={isChecked}
                  onChange={({ target }) => setIsChecked(target.checked)}
                />
                <Text isError={isError && !isChecked}>
                  I acknowledge that I have read and agreed to the
                  <StyledLink to="/terms-of-service">
                    {' Terms of Service'}
                  </StyledLink>
                  .
                </Text>
              </Wrap>
            </Terms>
            <StyledButton type="submit">
              {isLoading ? (
                <Loader size={24} thickness={2} color="#fff" />
              ) : (
                'Register'
              )}
            </StyledButton>
            <ToLogin>
              Already have an account?
              <Link to="/sign-in" replace>
                {' '}
                Login here
              </Link>
            </ToLogin>
          </AuthWrapper>
        </FormWrapper>
        <Footer />
      </SideWrapper>
    </StyledAuth>
  );
};

const ValidationWrap = styled.div`
  padding-top: 32px;

  ul {
    margin: 0;
  }
`;

const Label = styled.label<{ isError?: boolean }>`
  display: flex;
  flex-direction: column;
  color: #6c7278;
  row-gap: 12px;
  font-size: 16px;
  font-weight: 500;

  ${({ isError }) => isError
          && css`
            color: var(--primary-red-color);

            button {
              border: 1px solid #ff3333;
            }
          `}
`;

const Text = styled.div<{ isError?: boolean }>`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.02em;
  color: #1a1c1e;
  line-height: 120%;
  user-select: none;

  ${({ isError }) => isError
          && css`
            color: var(--primary-red-color);
          `}
`;

const Wrap = styled.label`
  display: flex;
  align-items: center;
  column-gap: 10px;
  cursor: pointer;
`;

const TermsTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #1a1c1e;
`;

const Terms = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  padding: 32px 0;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;

  > label {
    width: calc(50% - 16px);
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 32px;
`;

const StyledAuth = styled.div`
  display: grid;
  grid-template-columns: 44% auto;
  min-height: inherit;
`;

const SideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  grid-gap: 20px;
  padding: 20px;
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LeftSide = styled(SideWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 60px;
  background-color: var(--primary-dark-color);

  * {
    color: #fff;
  }
`;

const LeftSideTextBlock = styled.div`
  width: 100%;
  max-width: 550px;

  p {
    font-size: 24px;
  }
`;

const LogoImage = styled.img`
  margin-bottom: 48px;
  width: 187px;
`;

const Title = styled.h1`
  margin-bottom: 48px;
  font-size: 40px;
  line-height: 150%;

  span {
    background: -webkit-linear-gradient(95deg, #27a376 0.82%, #ffdc61 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  grid-gap: 24px;

  svg {
    min-width: 24px;
    height: 24px;
  }
`;

const AuthWrapper = styled.form`
  padding: 32px;
  width: 100%;
  max-width: 628px;
  border-radius: 16px;
  background-color: #fff;
`;

const PageTitle = styled.h1`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;

const StyledInput = styled(Input)`
  width: 100%;
  max-width: 420px;

  span {
    color: #fff;
  }
`;

const StyledButton = styled(Button)`
  margin-bottom: 32px;
  width: 100%;
`;

const ToLogin = styled.p`
  color: #6c7278;
  font-weight: 500;
  text-align: center;

  a {
    color: var(--primary-green-color);
    font-weight: 500;
    transition: 0.1s ease-in-out;

    :hover {
      color: var(--primary-green-hover-color);
    }
  }
`;

const StyledLink = styled(Link)`
  transition: .1s ease-in-out;
  color: var(--primary-green-color);
  
  :hover {
    color: var(--primary-green-hover-color);
  }
`;

export default Auth;
