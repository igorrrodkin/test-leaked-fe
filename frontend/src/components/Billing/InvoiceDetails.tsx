import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import RightArrowIcon from '@/assets/icons/RightArrowIcon';

import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer';

import { getInvoiceDetailsAction } from '@/store/actions/billingActions';

import { selectInvoiceDetails } from '@/store/selectors/billingSelectors';

import useToggle from '@/hooks/useToggle';

import { AppDispatch } from '@/store';

import LoadingContainer from '../LoadingContainer';

interface Props {
  startLink: string;
  visitedFrom: string
}

const InvoiceDetails: FC<Props> = ({ startLink, visitedFrom }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const invoiceDetails = useSelector(selectInvoiceDetails);

  const [isDataLoading, toggleIsDataLoading] = useToggle(true);

  const goToBilling = () => {
    navigate(visitedFrom);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (params.invoiceNumber) {
          toggleIsDataLoading(true);
          await dispatch(getInvoiceDetailsAction(params.invoiceNumber));
        }
        toggleIsDataLoading(false);
      } catch (e) {
        toggleIsDataLoading(false);
        navigate('/notFound', {
          replace: true,
          state: {
            goBack: `${visitedFrom}`,
          },
        });
      }
    };

    getData();
  }, []);

  return (
    <PageContainer contentPadding="32px 0">
      {!isDataLoading ? (
        invoiceDetails ? (
          <>
            <PageHeader>
              <LineNavigationWrapper>
                <StyledBackIcon onClick={goToBilling} />
                <LineNavigation>
                  <TopBackSpan onClick={goToBilling}>
                    Billing
                  </TopBackSpan>
                  <RightArrowIcon />
                  <span>
                    {params.invoiceNumber}
                  </span>
                </LineNavigation>
              </LineNavigationWrapper>
            </PageHeader>
            <NavWrapper>
              <Nav>
                <StyledNavLink
                  to={`/${startLink}/invoiceDetails/${params.invoiceNumber}`}
                  end
                >
                  Invoice PDF
                </StyledNavLink>
                <StyledNavLink
                  to={`/${startLink}/invoiceDetails/${params.invoiceNumber}/matters`}
                  end
                >
                  Matters
                </StyledNavLink>
                <StyledNavLink
                  to={`/${startLink}/invoiceDetails/${params.invoiceNumber}/orders`}
                  end
                >
                  Orders
                </StyledNavLink>
                <StyledNavLink
                  to={`/${startLink}/invoiceDetails/${params.invoiceNumber}/payments-credits`}
                  end
                >
                  Payments & Credits
                </StyledNavLink>
              </Nav>
            </NavWrapper>
            <LoadingContainer isLoading={isDataLoading}>
              <Outlet />
            </LoadingContainer>
          </>
        ) : <Navigate to={visitedFrom} />
      ) : <Loader />}
    </PageContainer>
  );
};

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 1rem;
  margin: 0 32px 32px;

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

const LineNavigation = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

const TopBackSpan = styled.span`
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

const NavWrapper = styled.div`
  margin: 0 32px 24px;
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

export default InvoiceDetails;
