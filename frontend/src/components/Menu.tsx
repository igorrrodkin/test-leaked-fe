import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styled, { css } from 'styled-components';

import BoxIcon from '@/assets/icons/BoxIcon';
import InvoiceIcon from '@/assets/icons/InvoiceIcon';
import KeyIcon from '@/assets/icons/KeyIcon';
import LogsIcon from '@/assets/icons/LogsIcon';
import NoticesIcon from '@/assets/icons/NoticesIcon';
import OrdersIcon from '@/assets/icons/OrdersIcon';
import OrganisationsMenuIcon from '@/assets/icons/OrganisationsMenuIcon';
import PinnedServicesMenuIcon from '@/assets/icons/PinnedServicesMenuIcon';
import PriceListsMenuIcon from '@/assets/icons/PriceListsMenuIcon';
import ReportingIcon from '@/assets/icons/ReportingIcon';
import RightArrowIcon from '@/assets/icons/RightArrowIcon';
import UsersMenuIcon from '@/assets/icons/UsersMenuIcon';
import logo from '@/assets/logo-white.png';

import { IPinedServices } from '@/pages/AllServices';

import { orderActions } from '@/store/actions/orderActions';
import { servicesActions } from '@/store/actions/servicesActions';

import { FullfilmentType, IOrganisationService } from '@/store/reducers/services';
import { Roles } from '@/store/reducers/user';

import { selectIsOrderStarted, selectOrderProducts, selectSelectedRegion } from '@/store/selectors/orderSelectors';
import {
  selectOrganisationServices,
  selectPinedServices,
  selectServicesModal,
} from '@/store/selectors/servicesSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import getRegionsData, { ExistingRegions } from '@/utils/getRegionsData';

const mockedData = getRegionsData();

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUser)!;
  const servicesModal = useSelector(selectServicesModal);
  const pinnedServices = useSelector(selectPinedServices) || {};
  const allServices = useSelector(selectOrganisationServices);
  const selectedRegion = useSelector(selectSelectedRegion);
  const isOrderStarted = useSelector(selectIsOrderStarted);
  const orderProducts = useSelector(selectOrderProducts);

  const goToAllServices = () => {
    dispatch(servicesActions.setServicesModal(true));
  };

  useEffect(() => {
    dispatch(servicesActions.setServicesModal(false));
  }, [location.pathname]);

  const servicesId = useMemo(
    () => Object.values(pinnedServices as IPinedServices).flat(),
    [pinnedServices],
  );

  const services = useMemo(
    () => servicesId.reduce((acc, serviceId) => {
      const foundService = allServices.find(
        ({ productId }) => serviceId === productId,
      );
      return [...acc, ...(foundService ? [foundService] : [])];
    }, [] as IOrganisationService[]),
    [servicesId, allServices],
  );

  const closeModal = () => {
    dispatch(servicesActions.setServicesModal(false));
  };

  const goToNewOrder = (region: ExistingRegions, productId: string, isManual: boolean) => () => {
    closeModal();

    if (isManual) {
      dispatch(orderActions.setProductToScroll(productId));
    }

    if (isOrderStarted || orderProducts?.length) {
      let regionIndex = mockedData.findIndex(
        (el) => el.region === region,
      );

      if (regionIndex < 0) regionIndex = mockedData.findIndex((el) => el.region);

      let serviceIndex = mockedData[regionIndex].services.findIndex(
        (el) => el.productId === productId,
      );
      serviceIndex = serviceIndex >= 0 ? serviceIndex : 0;

      if (regionIndex === selectedRegion) {
        dispatch(orderActions.setSelectedService(serviceIndex));

        return;
      }

      dispatch(orderActions.setResetOrder({
        isModalVisible: true,
        regionToChange: regionIndex,
        serviceToChange: serviceIndex,
      }));

      return;
    }

    dispatch(
      orderActions.setInitialOrderData({
        region,
        productId,
      }),
    );
    navigate(`/${region.toLocaleLowerCase()}`);
  };

  return (
    <StyledMenu>
      <LogoWrapper to="/dashboard/matters" onClick={closeModal}>
        <Logo src={logo} alt="Logo" />
      </LogoWrapper>
      <MenuWrap>
        <MenuSection>
          <Nav>
            <Item onClick={goToAllServices} isActive={servicesModal}>
              <BoxIcon />
              All Services
              <IconWrap>
                <RightArrowIcon />
              </IconWrap>
            </Item>
            <NavItem
              to="/dashboard"
              $isActiveModal={servicesModal}
              onClick={closeModal}
            >
              <OrdersIcon />
              Matters & Orders
            </NavItem>
            <NavItem
              to="/reporting"
              end
              $isActiveModal={servicesModal}
              onClick={closeModal}
            >
              <ReportingIcon />
              Reporting
            </NavItem>
          </Nav>
        </MenuSection>
        {user.role === Roles.SYSTEM_ADMIN && (
          <MenuSection>
            <Heading>SYSTEM SETTINGS</Heading>
            <Nav>
              <NavItem
                to="/notices"
                end
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <NoticesIcon />
                Notices
              </NavItem>
              <NavItem
                to="/organisations"
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <OrganisationsMenuIcon />
                Organisations
              </NavItem>
              <NavItem
                to="/api-keys"
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <KeyIcon />
                API Keys
              </NavItem>
              <NavItem
                to="/users"
                end
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <UsersMenuIcon />
                Users
              </NavItem>
              <NavItem
                to="/services"
                end
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <BoxIcon />
                Services
              </NavItem>
              <NavItem
                to="/price-lists"
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <PriceListsMenuIcon />
                Price Lists
              </NavItem>
              <NavItem
                to="/billings"
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <InvoiceIcon color="#6C7278" />
                Billing
              </NavItem>
              <NavItem
                to="/logs"
                $isActiveModal={servicesModal}
                onClick={closeModal}
              >
                <StyledLogsIcon />
                Logs
              </NavItem>
            </Nav>
          </MenuSection>
        )}
        <MenuSection>
          <Heading>
            <PinnedServicesMenuIcon />
            PINNED SERVICES
          </Heading>
          <Services>
            {services.map((el) => (
              <Service
                key={el.productId}
                onClick={goToNewOrder(
                  el.region,
                  el.productId,
                  el.fulfilmentType === FullfilmentType.MANUAL,
                )}
              >
                {el.searchType}
              </Service>
            ))}
          </Services>
        </MenuSection>
      </MenuWrap>
    </StyledMenu>
  );
};

const IconWrap = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const MenuWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 32px;
  flex: 1;
  width: calc(100% - 4px);
  scrollbar-color: rgba(255, 255, 255, 0.3);

  &::-webkit-scrollbar-thumb {
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: inset 0 0 0 transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    margin: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Service = styled.div`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: #6c7278;
  padding-left: 20px;
  cursor: pointer;
`;

const Services = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  padding-top: 16px;
`;

const StyledMenu = styled.menu`
  position: fixed;
  left: 0;
  margin: 0;
  padding: 18px 0 90px;
  min-width: 256px;
  max-width: 256px;
  height: 100vh;
  background-color: var(--primary-dark-color);
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const LogoWrapper = styled(Link)`
  display: block;
  padding: 0 20px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  text-align: center;
`;

const Logo = styled.img`
  max-width: 198px;
`;

const MenuSection = styled.div`
  margin-bottom: 32px;
  padding: 0 20px;
`;

const Heading = styled.h3`
  display: flex;
  grid-gap: 8px;
  margin-bottom: 16px;
  padding-left: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
`;

const Nav = styled.nav`
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Item = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  grid-gap: 16px;
  padding: 16px 8px 16px 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  ${({ isActive }) => isActive
          && css`
            color: #fff;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;

            svg * {
              stroke: #fff;
            }
          `}
`;

const StyledLogsIcon = styled(LogsIcon)``;

const NavItem = styled(NavLink)<{ $isActiveModal: boolean }>`
  display: flex;
  align-items: center;
  grid-gap: 16px;
  padding: 16px 8px 16px 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  ${({ $isActiveModal }) => !$isActiveModal
          && css`
            &.active {
              color: #fff;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;

              svg * {
                stroke: #fff;
              }

              ${StyledLogsIcon} * {
                stroke: #fff;
                fill: #fff;
              }
            }
          `}
`;

export default Menu;
