import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useIntercom } from 'react-use-intercom';
import styled from 'styled-components';

import Logo from '@/assets/logo-white.png';

import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

import { loginAction, userActions } from '@/store/actions/userActions';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

const Auth = () => {
  const [username, setUsername] = useInput();
  const [isUsernameChanged, toggleIsUsernameChanged] = useToggle();
  const [password, setPassword] = useInput();
  const [isPasswordChanged, toggleIsPasswordChanged] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const isFirstRender = useIsFirstRender();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { shutdown, boot } = useIntercom();

  const enterPress = useKeyPress('Enter');

  useEffect(() => {
    reloadIntercom();
  }, []);

  useEffect(() => {
    if (!isFirstRender) toggleIsUsernameChanged(true);
  }, [username]);

  useEffect(() => {
    if (!isFirstRender) toggleIsPasswordChanged(true);
  }, [password]);

  useEffect(() => {
    if (enterPress) {
      sendData();
    }
  }, [enterPress]);

  const sendData = async () => {
    if (username && password && !isEmailError && !isPasswordError) {
      try {
        toggleIsLoading(true);
        dispatch(userActions.setPopup(null));
        await dispatch(loginAction(username, password));
        navigate('/dashboard/matters', { replace: true });
      } finally {
        toggleIsLoading(false);
      }
    }
  };

  const isEmailError = isUsernameChanged && !username.length;
  const isPasswordError = isPasswordChanged && password.length < 8;

  const reloadIntercom = async () => {
    await shutdown();
    boot();
  };

  return (
    <StyledAuth>
      <LeftSide>
        <LeftSideTextBlock>
          <LogoImage src={Logo} alt="Alts logo" />
          <Title>Let’s empower your document product today.</Title>
          <p>We help to complete all your conveyancing needs easily</p>
        </LeftSideTextBlock>
      </LeftSide>
      <SideWrapper>
        <FormWrapper>
          <AuthWrapper>
            <PageTitle>Login to your account</PageTitle>
            <StyledInput
              type="email"
              value={username}
              onChange={setUsername}
              label="Username"
              labelMarginBottom={12}
              placeholder="Enter username"
              autoComplete="username webauthn"
            />
            <StyledInput
              type="password"
              value={password}
              onChange={setPassword}
              label="Password"
              labelMarginBottom={12}
              placeholder="Enter password"
              autoComplete="current-password webauthn"
            />
            <Additional>
              <StyledLink to="/forgot-password">Forgot Password</StyledLink>
            </Additional>
            <StyledButton
              type="button"
              disabled={
                isEmailError
                || isPasswordError
                || !isUsernameChanged
                || !isPasswordChanged
              }
              onClick={sendData}
            >
              {isLoading ? (
                <Loader size={24} thickness={2} color="#fff" />
              ) : (
                'Login'
              )}
            </StyledButton>
            <ToRegistration>
              Don’t have an account?
              <Link to="/sign-up"> Register Here</Link>
            </ToRegistration>
          </AuthWrapper>
        </FormWrapper>
        <Footer />
      </SideWrapper>
    </StyledAuth>
  );
};

const StyledAuth = styled.div`
  display: grid;
  grid-template-columns: calc(50% + 30px) auto;
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

const FormWrapper = styled.form`
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
  font-size: 56px;
  line-height: 130%;
`;

const AuthWrapper = styled.div`
  padding: 32px;
  width: 100%;
  max-width: 480px;
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

const Additional = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 34px;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-green-color);
  transition: 0.1s ease-in-out;
  margin-left: auto;

  :hover {
    color: var(--primary-green-hover-color);
  }
`;

const StyledButton = styled(Button)`
  margin-bottom: 32px;
  width: 100%;
`;

const ToRegistration = styled.p`
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

export default Auth;
