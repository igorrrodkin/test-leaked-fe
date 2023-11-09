import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const NotFound: FC = () => {
  const location = useLocation();

  return (
    <Wrapper>
      <H2>404 - Not found</H2>
      <StyledLink to={location.state?.goBack || '/dashboard/matters'}>Go back</StyledLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - var(--search-height));
`;

const H2 = styled.h2`
  text-align: center;
  margin: 20px 0;
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 22px;
  margin: 0 auto;
  height: 38px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-green-color);
  transition: .1s ease-in-out;
  
  :disabled {
    background-color: rgba(39, 163, 118, 0.6);
    cursor: default;
  }
  
  :not(:disabled):hover {
    background-color: var(--primary-green-hover-color);
  }
`;
