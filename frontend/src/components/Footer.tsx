import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => (
  <StyledFooter>
    <Copyright>{`© ${new Date().getFullYear()} ALTS CORP. All rights reserved.`}</Copyright>
    <StyledLink to="/terms-of-service">Terms Of Service</StyledLink>
    <StyledLink to="/privacy">Privacy Policy</StyledLink>
  </StyledFooter>
);

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 10px;
  margin-top: 36px;

  @media (max-width: 895px) {
    flex-wrap: wrap;

    & > span {
      flex: 1 0 100%;
      width: 100;
      order: 3;
      text-align: center;
    }
  }
`;

const Copyright = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #6c7278;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  transition: 0.1s ease-in-out;

  :hover {
    color: var(--primary-green-color);
  }
`;

export default Footer;
