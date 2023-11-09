import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@/assets//logo-white.png';

import PasswordValidation, { IPasswordValidation } from '@/components/Auth/PasswordValidation';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';

import { updatePasswordAction } from '@/store/actions/userActions';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useToggle from '@/hooks/useToggle';

const GetResetLink = () => {
  const [password, setPassword] = useInput();
  const [passwordCopy, setPasswordCopy] = useInput();
  const [isPasswordChanged, toggleIsPasswordChanged] = useToggle();
  const [isPasswordCopyChanged, toggleIsPasswordCopyChanged] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();

  const isFirstRender = useIsFirstRender();
  const location = useLocation().pathname.split('/');
  const otp = location.length > 2 ? location[2] : null;

  const encode = (str: string) => {
    try {
      return window.atob(str);
    } catch (error) {
      return 'error';
    }
  };

  const username = location.length > 2 ? encode(location[3]) : null;

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirstRender) toggleIsPasswordChanged(true);
  }, [password]);

  useEffect(() => {
    if (!isFirstRender) toggleIsPasswordCopyChanged(true);
  }, [passwordCopy]);

  const submit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (username && otp && password && !isPasswordError && passwordCopy && !isPasswordCopyError) {
      try {
        toggleIsLoading(true);
        await dispatch(updatePasswordAction({
          otp,
          username,
          newPassword: password,
        }));
        toggleIsLoading(false);

        navigate('/sign-in', { replace: true });
      } catch (e) {
        toggleIsLoading(false);
      }
    }
  };

  const passwordValidation: IPasswordValidation = useMemo(() => ({
    eightCharacters: password.length >= 8,
    upperCaseLetter: /^.*[A-Z].*$/.test(password),
    lowerCaseLetter: /^.*[a-z].*$/.test(password),
    oneDigit: /^.*[0-9].*$/.test(password),
  }), [password]);
  const isPasswordError = useMemo(() => (
    isPasswordChanged && Object.values(passwordValidation).some((el) => el === false)
  ), [isPasswordChanged, password]);
  const isPasswordCopyError = password !== passwordCopy;

  return (
    <Page>
      <Content>
        <ContentText>
          <LogoWrapper>
            <img src={Logo} alt="Alts logo" />
          </LogoWrapper>
          <PageTitle
            fontSize={56}
            marginBottom="0"
            textAlign="center"
          >
            Update Your Password
          </PageTitle>
          <Description>
            Minimum 8 characters with a combination of letters and numbers
          </Description>
        </ContentText>
        <Form onSubmit={submit}>
          <FormTitle>Set your new password</FormTitle>
          <Input
            type="password"
            label="New Password"
            labelMarginBottom={12}
            value={password}
            onChange={setPassword}
            placeholder="Input your new password"
            inputMarginBottom="12px"
            autoComplete="new-password"
            isError={isPasswordError && isPasswordChanged}
          />
          <PasswordValidation validationConfig={passwordValidation} />
          <PasswordWrapper>
            <Input
              type="password"
              label="Confirm Your New Password"
              labelMarginBottom={12}
              value={passwordCopy}
              onChange={setPasswordCopy}
              placeholder="Re-type your new password"
              inputMarginBottom="12px"
              autoComplete="off"
              isError={isPasswordCopyError && isPasswordCopyChanged}
            />
            {isPasswordCopyError && isPasswordCopyChanged ? (
              <PasswordError>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 5.25H9.75V6.75H8.25V5.25ZM8.25 8.25H9.75V12.75H8.25V8.25ZM9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15Z" fill="#DD5757" />
                </svg>
                Password doesn&apos;t match
              </PasswordError>
            ) : ''}
          </PasswordWrapper>
          <Button
            type="submit"
            disabled={!password || !isPasswordChanged || isPasswordCopyError}
            style={{ width: '100%', height: '50px' }}
          >
            {isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Submit'}
          </Button>
        </Form>
      </Content>
      <Footer />
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 60px 60px 30px;
  min-height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 50px;
`;

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 24px;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 227px;
  background-color: var(--primary-dark-color);
  border-radius: 100px;
  padding: 5px 0;
  
  img {
    width: 160px;
  }
`;

const Description = styled.p`
  font-size: 24px;
`;

const Form = styled.form`
  padding: 32px;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  background-color: #fff;
`;

const FormTitle = styled.h4`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;

const PasswordWrapper = styled.div`
  margin-bottom: 32px;
`;

const PasswordError = styled.span`
  display: flex;
  align-items: center;
  grid-gap: 8px;
  font-size: 14px;
  color: var(--primary-red-color);
`;

export default GetResetLink;
