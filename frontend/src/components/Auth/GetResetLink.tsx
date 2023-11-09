import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@/assets/logo-white.png';

import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';

import { getResetLinkAction, userActions } from '@/store/actions/userActions';

import { PopupTypes } from '@/store/reducers/user';

import useInput from '@/hooks/useInput';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import useKeyPress from '@/hooks/useKeyPress';
import useToggle from '@/hooks/useToggle';

const GetResetLink = () => {
  const [username, setUsername] = useInput();
  const [isUsernameChanged, toggleIsUsernameChanged] = useToggle();
  const [isLoading, toggleIsLoading] = useToggle();
  const isFirstRender = useIsFirstRender();

  const enterPress = useKeyPress('Enter');

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirstRender) toggleIsUsernameChanged(true);
  }, [username]);

  useEffect(() => {
    if (enterPress) {
      submit();
    }
  }, [enterPress]);

  const submit = async () => {
    if (isUsernameCorrect) {
      try {
        toggleIsLoading(true);
        await dispatch(getResetLinkAction(username));
        toggleIsLoading(false);
        dispatch(userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Email was sent',
          additionalText: 'Please check your mailbox and create new password',
        }));
        navigate('/sign-in', { replace: true });
      } catch (e) {
        toggleIsLoading(false);
      }
    }
  };

  const isUsernameCorrect = username.length;

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
            Forgot Password
          </PageTitle>
          <Description>
            Input your username to receive a reset link
          </Description>
        </ContentText>
        <Form>
          <FormTitle>Enter your username</FormTitle>
          <Input
            label="Username"
            labelMarginBottom={12}
            value={username}
            onChange={setUsername}
            placeholder="Input your username"
            inputMarginBottom="32px"
            isError={!isUsernameCorrect && isUsernameChanged}
            autoComplete="username webauthn"
          />
          <Buttons>
            <Button
              isCancel
              onClick={() => navigate('/sign-in', { replace: true })}
              style={{ height: '50px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={!isUsernameCorrect}
              style={{ height: '50px' }}
            >
              {isLoading ? <Loader size={24} thickness={2} color="#fff" /> : 'Continue'}
            </Button>
          </Buttons>
        </Form>
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

const Form = styled.div`
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

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`;

export default GetResetLink;
