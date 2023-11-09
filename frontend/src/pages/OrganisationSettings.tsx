import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  Navigate, NavLink, Route, Routes,
} from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import BillingIcon from '@/assets/icons/BillingIcon';
import KeyIcon from '@/assets/icons/KeyIcon';
import OrganisationsIcon from '@/assets/icons/OrganisationsIcon';
import PriceListsIcon from '@/assets/icons/PriceListsIcon';
import RightArrowIcon from '@/assets/icons/RightArrowIcon';
import ServicesIcon from '@/assets/icons/ServicesIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';
import UserIcon from '@/assets/icons/UserIcon';
import UsersIcon from '@/assets/icons/UsersIcon';

import LoadingContainer from '@/components/LoadingContainer';
import OrganisationAPIKeys from '@/components/OrganisationSettings/OrganisationAPIKeys';
import OrganisationDetails from '@/components/OrganisationSettings/OrganisationDetails';
import OrganisationPreferences from '@/components/OrganisationSettings/OrganisationPreferences';
import OrganisationPriceLists from '@/components/OrganisationSettings/OrganisationPriceLists';
import OrganisationServices from '@/components/OrganisationSettings/OrganisationServices';
import OrganisationUsers from '@/components/OrganisationSettings/OrganisationUsers';
import PageContainer from '@/components/PageContainer';
import SettingsBilling from '@/components/Settings/Billing/SettingsBilling';
import MyDetails from '@/components/Settings/MyDetails';

import {
  getOrganisationDetailsAction,
  organisationsActions,
} from '@/store/actions/organisationsActions';

import { selectOrganisation } from '@/store/selectors/organisationsSelector';

import { AppDispatch } from '@/store';

const OrganisationSettings = () => {
  const { organisationId } = useParams<{ organisationId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const organisation = useSelector(selectOrganisation);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    getData();

    return () => {
      dispatch(organisationsActions.setOrganisationDetails(null));
    };
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      await dispatch(getOrganisationDetailsAction(+organisationId!));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      navigate('/organisations', {
        replace: true,
      });
    }
  };

  const goToOrganisations = () => {
    navigate('/organisations');
  };

  return (
    <PageContainer contentPadding="32px 0 0">
      <PageHeader>
        <PageNavigation>
          <IconWrap onClick={goToOrganisations}>
            <ArrowBackIcon />
          </IconWrap>
          {organisation && (
            <>
              <Item onClick={goToOrganisations}>Organisations</Item>
              <ArrowWrap>{'>'}</ArrowWrap>
              <Item onClick={goToOrganisations}>{organisation?.name}</Item>
              <ArrowWrap>{'>'}</ArrowWrap>
              <TitleItem>Settings</TitleItem>
              {' '}
            </>
          )}
        </PageNavigation>
      </PageHeader>
      <Content>
        <Navigation>
          <DisabledRoute>
            <span>
              <UserIcon />
              My Details
            </span>
            <RightArrowIcon />
          </DisabledRoute>
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/organisation-details`}
          >
            <span>
              <OrganisationsIcon />
              Organisation Details
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/preferences`}
          >
            <span>
              <SettingsIcon />
              Preferences
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <StyledNavLink to={`/organisations/${organisationId}/settings/users`}>
            <span>
              <UsersIcon />
              Users
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/billing`}
          >
            <span>
              <BillingIcon />
              Payment Methods
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <Line />
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/services`}
          >
            <span>
              <ServicesIcon />
              Services
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/price_list`}
          >
            <span>
              <PriceListsIcon />
              Price Lists
            </span>
            <RightArrowIcon />
          </StyledNavLink>
          <StyledNavLink
            to={`/organisations/${organisationId}/settings/api-keys`}
          >
            <span>
              <KeyIcon />
              API Keys
            </span>
            <RightArrowIcon />
          </StyledNavLink>
        </Navigation>
        <RightSide>
          <LoadingContainer isLoading={isLoading}>
            {organisation && (
            <Routes>
              <Route path="/my-details" element={<MyDetails />} />
              <Route
                path="/organisation-details"
                element={(
                  <OrganisationDetails
                    organisationId={+organisationId!}
                    organisation={organisation!}
                  />
                )}
              />
              <Route
                path="/services"
                element={(
                  <OrganisationServices
                    organisationId={+organisationId!}
                    organisationName={organisation.name}
                  />
                )}
              />
              <Route
                path="/billing"
                element={<SettingsBilling organisation={organisation} />}
              />
              <Route
                path="/users"
                element={
                  <OrganisationUsers organisationId={+organisationId!} />
                }
              />
              <Route
                path="/preferences"
                element={(
                  <OrganisationPreferences
                    organisationId={+organisationId!}
                  />
                )}
              />
              <Route
                path="/price_list"
                element={
                  <OrganisationPriceLists organisationId={+organisationId!} />
                }
              />
              <Route
                path="/api-keys"
                element={
                  <OrganisationAPIKeys organisationId={+organisationId!} />
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to="/organisation-details" replace />
                }
              />
            </Routes>
            )}
          </LoadingContainer>
        </RightSide>
      </Content>
    </PageContainer>
  );
};

const ArrowWrap = styled.span`
  padding: 0 8px 3px;
  color: #acb5bb;
`;

const IconWrap = styled.span`
  margin-right: 12px;
  cursor: pointer;
`;

const Item = styled.span`
  line-height: 24px;
  font-weight: 500;
  font-size: 14px;
  color: #acb5bb;
  padding-bottom: 3px;
  cursor: pointer;

  transition: all 0.3s ease;
  &:hover {
    color: inherit;
  }
`;

const TitleItem = styled.span`
  line-height: 24px;
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  padding-bottom: 3px;
`;

const PageNavigation = styled.span`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

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

const DisabledRoute = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-left: 3px solid transparent;
  min-width: 278px;
  width: 278px;
  cursor: default;

  span {
    display: flex;
    align-items: center;
    grid-gap: 12px;
    font-weight: 500;
    color: #acb5bb;

    svg {
      min-width: 20px;
      min-height: 20px;

      * {
        stroke: #acb5bb;
      }
    }
  }

  & > svg {
    min-width: 24px;
    min-height: 24px;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-left: 3px solid transparent;
  min-width: 278px;
  width: 278px;

  span {
    display: flex;
    align-items: center;
    grid-gap: 12px;
    font-weight: 500;

    svg {
      min-width: 22px;
      min-height: 22px;
      max-width: 22px;
      max-height: 22px;

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
  overflow-x: auto;
  padding: 32px;
`;

const Line = styled.div`
  margin-bottom: 12px;
  padding-top: 12px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
`;
export default OrganisationSettings;
