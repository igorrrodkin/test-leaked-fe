import { FC } from 'react';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

const OrganisationBilling: FC = () => (
  <PageContainer contentPadding="32px 0">
    <PageHeader>
      <div>
        <PageTitle marginBottom="0">Billing</PageTitle>
      </div>
    </PageHeader>
    <NavWrapper>
      <Nav>
        <StyledNavLink to="/billing" end>
          Summary
        </StyledNavLink>
        <StyledNavLink to="/billing/invoices">Invoices</StyledNavLink>
        <StyledNavLink to="/billing/payments-credits">Payments & Credits</StyledNavLink>
      </Nav>
    </NavWrapper>
    <Outlet />
  </PageContainer>
);

export default OrganisationBilling;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 1rem;
  margin-bottom: 32px;
  padding: 0 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const NavWrapper = styled.div`
  margin-bottom: 24px;
  padding: 0 32px;
`;

const Nav = styled.div`
  position: relative;
  display: flex;
  grid-gap: 1rem;
  border-bottom: 1px solid rgba(26, 28, 30, 0.2);
`;

const StyledNavLink = styled(NavLink)`
  margin-bottom: -1px;
  padding-bottom: 24px;
  color: rgba(26, 28, 30, 0.4);
  font-weight: 500;
  transition: color 0.1s ease-in-out;

  :not(&.active):hover {
    color: var(--primary-dark-hover-color);
  }

  &.active {
    color: var(--primary-dark-color);
    border-bottom: 2px solid var(--primary-dark-color);
  }
`;
