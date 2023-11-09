import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import base64 from 'base-64';
import styled from 'styled-components';

import fileEye from '@/assets/fileEye.png';
import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import RightArrowIcon from '@/assets/icons/RightArrowIcon';

import Button from '@/components/Button';
import Matters from '@/components/Dashboard/Matters';
import { IInitialQuery } from '@/components/Orders/FiltersOrdersTable';
import OrdersTableContainer from '@/components/Orders/OrdersTableContainer';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

import { userActions } from '@/store/actions/userActions';

import { OrderStatusEnum } from '@/store/reducers/user';

import { selectOrders, selectVisitedMatterFrom } from '@/store/selectors/userSelectors';

import { getObjectFromQueries } from '@/utils/api';

const Orders = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const dispatch = useDispatch<any>();

  const orders = useSelector(selectOrders);
  const visitedMatterFrom = useSelector(selectVisitedMatterFrom);

  const filteredOrders = orders.filter((item) => item.status !== OrderStatusEnum.EXPIRED);

  const decodedQuery = useMemo(() => base64.decode(search.slice(1)), [search]);

  const selectedMatter = useMemo(
    () => (getObjectFromQueries(decodedQuery) as IInitialQuery).matter,
    [decodedQuery],
  );

  const handleDocumentClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const order = filteredOrders[0];

    const orgId = order.organisation.id;
    const matterId = order.matter;
    const orderId = order.id;
    const orderItem = order.orderItems[0];

    let url;
    let query: string;

    url = `${orgId}/${matterId}`;
    query = `orderId=${orderId}`;

    if (orderItem?.fileKeys?.length) {
      query += '&linkId=0';
    }

    url += `?${base64.encode(query!)}`;

    const { location } = window;

    dispatch(userActions.setVisitedOrderDetailsFrom(location.pathname + location.search));

    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${location.origin}/dashboard/orders/${url}`,
        '_blank',
      );
    }

    navigate(`/dashboard/orders/${url}`);
  };

  const handleBackButtonClick = () => {
    navigate(visitedMatterFrom || '/dashboard/matters');
    dispatch(userActions.setSelectedMatter(null));
  };

  const handleGoToMatter = () => {
    navigate('/dashboard/matters');
    dispatch(userActions.setSelectedMatter(null));
  };

  return (
    <PageContainer>
      <PageHeader>
        <LineNavigationWrapper>
          {selectedMatter ? (
            <>
              <StyledBackIcon onClick={handleBackButtonClick} />
              <LineNavigation>
                <BackSpan onClick={handleGoToMatter}>Matters</BackSpan>
                <RightArrowIcon />
                <span>{base64.decode(selectedMatter)}</span>
              </LineNavigation>
            </>
          ) : (
            <PageTitle marginBottom="0">Matters & Orders</PageTitle>
          )}
        </LineNavigationWrapper>
        <DocumentWrapper>
          {selectedMatter && filteredOrders.length ? (
            <DocumentBtn
              type="button"
              onClick={handleDocumentClick}
            >
              <img src={fileEye} alt="Open document" />
            </DocumentBtn>
          ) : null}
          <Link to="/all">
            <StyledButton>
              <svg fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Order
            </StyledButton>
          </Link>
        </DocumentWrapper>
      </PageHeader>
      <NavWrapper>
        <Nav>
          {!selectedMatter && (
            <>
              <StyledNavLink to="/dashboard/matters" end>
                Matters
              </StyledNavLink>
              <StyledNavLink to="/dashboard/orders">Orders</StyledNavLink>
            </>
          )}
        </Nav>
      </NavWrapper>
      <Routes>
        <Route path="/matters/*" element={<Matters />} />
        <Route path="/orders" element={<OrdersTableContainer />} />
        <Route path="/" element={<Navigate to="/dashboard/matters" />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard/matters" replace />}
        />
      </Routes>
    </PageContainer>
  );
};

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 1rem;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const LineNavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 12px;

  span:last-child {
    font-weight: 600;
  }
`;

const BackSpan = styled.span`
  color: #acb5bb;
  font-weight: 500;

  transition: all 0.3s ease;
  &:hover {
    color: inherit;
    cursor: pointer;
  }
`;

const StyledBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
`;

const LineNavigation = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 50px;

  svg {
    margin-right: 8px;
    width: 1rem;
    height: 1rem;
  }
`;

const NavWrapper = styled.div`
  margin-bottom: 24px;
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

const DocumentWrapper = styled.div`
  display: flex;
  align-item: center;
  gap: 20px;
`;

const DocumentBtn = styled.button`
  padding: 10px;
  aspect-ratio: 1;
  border-style: none;
  border-radius: 10px;
  background-color: #f4f7f8;
  cursor: poinet;

  & > img {
    width: 30px;
  }
`;

export default Orders;
