import React from 'react';
import { useSelector } from 'react-redux';
import {
  NavLink, Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

import BillingIcon from '@/assets/icons/BillingIcon';
import KeyIcon from '@/assets/icons/KeyIcon';
import OrganisationsIcon from '@/assets/icons/OrganisationsIcon';
import RightArrowIcon from '@/assets/icons/RightArrowIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import UserIcon from '@/assets/icons/UserIcon';
import UsersIcon from '@/assets/icons/UsersIcon';

import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

import { Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

const Settings = () => {
  const user = useSelector(selectUser);

  return (
    <PageContainer contentPadding="32px 0 0">
      <PageHeader>
        <PageTitle marginBottom="16px">Settings</PageTitle>
        Settings your dashboard here
      </PageHeader>
      <Content>
        <Navigation>
          <StyledNavLink to="/settings/my-details">
            <span>
              <UserIcon />
              My Details
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          {(user!.role === Roles.CUSTOMER_ADMIN
            || user!.role === Roles.SYSTEM_ADMIN) && (
            <StyledNavLink to="/settings/organisation-details">
              <span>
                <OrganisationsIcon />
                Organisation Details
              </span>
              <RightArrowIcon />
            </StyledNavLink>
          )}
          <StyledNavLink to="/settings/preferences">
            <span>
              <SettingsIcon />
              Preferences
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          {(user!.role === Roles.CUSTOMER_ADMIN
            || user!.role === Roles.SYSTEM_ADMIN) && (
            <StyledNavLink to="/settings/users">
              <span>
                <UsersIcon />
                Users
              </span>
              <RightArrowIcon />
            </StyledNavLink>
          )}
          {(user!.role === Roles.CUSTOMER_ADMIN
            || user!.role === Roles.SYSTEM_ADMIN) && (
            <StyledNavLink to="/settings/billing">
              <span>
                <BillingIcon />
                Payment Methods
              </span>
              <RightArrowIcon />
            </StyledNavLink>
          )}
          {(user!.role === Roles.CUSTOMER_ADMIN
            || user!.role === Roles.SYSTEM_ADMIN) && (
            <StyledNavLink to="/settings/api-keys">
              <span>
                <KeyIcon strokeWidth="1.5" />
                API Keys
              </span>
              <RightArrowIcon />
            </StyledNavLink>
          )}
        </Navigation>
        <RightSide>
          <Outlet />
        </RightSide>
      </Content>
    </PageContainer>
  );
};

const PageHeader = styled.div`
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
  color: rgba(17, 24, 39, 0.7);
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(334px, 334px) auto;
  grid-template-rows: 1fr;
  flex-grow: 1;
`;

const Navigation = styled.nav`
  padding: 24px 32px 24px 24px;
  height: 100%;
  border-right: 1px solid rgba(26, 28, 30, 0.16);
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-left: 3px solid transparent;

  span {
    display: flex;
    align-items: center;
    grid-gap: 12px;
    font-weight: 500;

    svg {
      min-width: 20px;
      min-height: 20px;

      * {
        stroke: #6c7278;
      }
    }
  }

  & > svg {
    min-width: 24px;
    min-height: 24px;
  }

  :hover {
    background-color: var(--primary-green-background-color);
  }

  &.active {
    border-left: 3px solid var(--primary-green-color);
    background-color: var(--primary-green-background-color);

    span {
      color: var(--primary-green-color);
      font-weight: 600;
    }

    svg * {
      stroke: var(--primary-green-color);
    }
  }
`;

const RightSide = styled.div`
  padding: 32px;
  overflow-x: auto;
`;

export default Settings;
