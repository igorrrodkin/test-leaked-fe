import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';

import OrdersTable from '@/components/Orders/OrdersTableContainer';
import PageContainer from '@/components/PageContainer';

const GlobalSearchPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer contentPadding="0">
      <Header>
        <IconWrap onClick={goBack}>
          <ArrowBackIcon />
        </IconWrap>
        <Title>Global Search</Title>
      </Header>
      <TableWrap>
        <OrdersTable />
      </TableWrap>
    </PageContainer>
  );
};

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TableWrap = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  column-gap: 24px;
  padding: 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.02em;
  color: #111827;
`;

export default GlobalSearchPage;
