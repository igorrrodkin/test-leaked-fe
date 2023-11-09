import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';

import LoadingContainer from '@/components/LoadingContainer';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';

import { IBaseOrganisationsInfo } from '@/store/reducers/organisations';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

type ContextType = { currentOrg: IBaseOrganisationsInfo };

export function useCurrentBillingOrg() {
  return useOutletContext<ContextType>();
}

const Billings: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isOrganisationsLoading, setIsOrganisationsLoading] = useToggle(true);

  useEffect(() => {
    const getOrganisations = async () => {
      setIsOrganisationsLoading(true);
      await dispatch(getBaseOrganisationsInfoAction());

      setIsOrganisationsLoading(false);
    };

    getOrganisations();
  }, []);

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <LineNavigationWrapper>
          <PageTitle marginBottom="0">Billing</PageTitle>
        </LineNavigationWrapper>
      </PageHeader>
      <NavWrapper>
        <Nav>
          <StyledNavLink to="/billings" end>
            Summary
          </StyledNavLink>
          <StyledNavLink to="/billings/invoices">Invoices</StyledNavLink>
          <StyledNavLink to="/billings/payments-credits">Payments & Credits</StyledNavLink>
        </Nav>
      </NavWrapper>
      <LoadingContainer isLoading={isOrganisationsLoading}>
        <Outlet />
      </LoadingContainer>
    </PageContainer>
  );
};

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

const LineNavigationWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 12px;

  span:last-child {
    font-weight: 600;
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

export default Billings;
