import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@/assets//logo-white.png';

import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';

import { validateOtpAction } from '@/store/actions/userActions';

import useToggle from '@/hooks/useToggle';

const LoginNow = () => {
  const [isLoading, toggleIsLoading] = useToggle();

  const location = useLocation().pathname.split('/');
  const otp = location.length > 2 ? location[2] : null;

  useEffect(() => {
    validate();
  }, []);

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

  const validate = async () => {
    if (otp && username) {
      try {
        toggleIsLoading(true);
        await dispatch(validateOtpAction(username, otp));
        toggleIsLoading(false);
      } catch (e) {
        toggleIsLoading(false);
        navigate('/sign-in', { replace: true });
      }
    }
  };

  return (
    <Page>
      <LogoWrapper>
        <img src={Logo} alt="Alts logo" />
      </LogoWrapper>
      <Content>
        <CheckmarkContainer>
          <CheckmarkWrapper>
            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.75 20.2125L6.53751 15L4.76251 16.7625L11.75 23.7501L26.75 8.75005L24.9875 6.98755L11.75 20.2125Z" fill="#27A376" />
            </svg>
          </CheckmarkWrapper>
        </CheckmarkContainer>
        <PageTitle
          fontSize={56}
          marginBottom="0"
          textAlign="center"
        >
          {otp && username ? 'Account successfully Verified' : 'Account registered successfully'}
        </PageTitle>
        <Description>
          {otp && username
            ? 'Let’s login to our system, and enjoy the experience'
            : 'Please check your email, to verify your account'}
        </Description>
        {otp && username ? (
          <Button
            onClick={() => navigate('/sign-in', { replace: true })}
            style={{ width: '100%', maxWidth: '300px', height: '50px' }}
          >
            {isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Login Now'}
          </Button>
        ) : ''}
      </Content>
      <Footer />
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 60px 60px 30px;
  min-height: 100vh;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 50px;
`;

const CheckmarkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-green-color);
`;

const CheckmarkWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
`;

const Description = styled.p`
  font-size: 24px;
`;

export default LoginNow;
