import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import ExportIcon from '@/assets/icons/ExportIcon';

import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer';
import PricesTable from '@/components/PriceList/PricesTable';

import { ExportCSV } from '@/pages/Reporting';

import { getPriceListAction, userActions } from '@/store/actions/userActions';

import { IPriceListCsv, Product, Roles } from '@/store/reducers/user';

import { selectPriceList, selectUser } from '@/store/selectors/userSelectors';

import convertTimestamp from '@/utils/convertTimestamp';
import getCsvFile from '@/utils/getCsvFile';

const PriceList = () => {
  const user = useSelector(selectUser);
  const priceList = useSelector(selectPriceList);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [csvFilteredPriceList, setCsvFilteredPriceList] = useState<Product[]>(
    priceList?.priceList || [],
  );

  useEffect(() => {
    if (priceList) return;

    dispatch(getPriceListAction());

    return () => {
      dispatch(userActions.setPriceList(null));
    };
  }, []);

  const handleExportCSV = async () => {
    if (!priceList?.priceList) return;

    const data = [
      ...priceList.priceList.map((item) => ({
        Collection: item.collection,
        Supplier: item.supplier,
        'Search Type': item.searchType,
        Description: item.description,
        'Product Code': item.productCode,
        'Price ex GST': (Math.round(+item.priceExGST) / 100).toFixed(2),
        GST: (Math.round(+item.GST) / 100).toFixed(2),
        'Price incl GST': (Math.round(+item.priceInclGST) / 100).toFixed(2),
      })),
    ] as IPriceListCsv[];

    const fileName = `${priceList?.priceListName.replaceAll(
      ' ',
      '',
    )}_${convertTimestamp(new Date().getTime()).toString()}`;

    getCsvFile(data, fileName);
  };

  return (
    <PageContainer contentPadding="32px 0">
      {priceList ? (
        <>
          <NavLineContainer>
            <StyledArrowBackIcon onClick={() => navigate(-1)} />
            <NavLine>
              <NavItem onClick={() => navigate('/price-lists')}>
                Price Lists
              </NavItem>
              <ArrowRightIcon />
              <NavItem>{priceList.priceListName}</NavItem>
            </NavLine>
            {user?.role === Roles.SYSTEM_ADMIN && (
              <ExportWrap>
                <ExportCSV
                  onClick={handleExportCSV}
                  disabled={csvFilteredPriceList.length === 0}
                >
                  <ExportIcon />
                  Export CSV
                </ExportCSV>
              </ExportWrap>
            )}
          </NavLineContainer>
          <Content>
            <PricesTable
              priceList={priceList.priceList}
              setCsvFilteredPriceList={setCsvFilteredPriceList}
            />
          </Content>
        </>
      ) : (
        <Loader />
      )}
    </PageContainer>
  );
};

const NavLineContainer = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 12px;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
`;

const NavLine = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
`;

const NavItem = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #acb5bb;

  :last-child {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-dark-color);
  }

  :first-child {
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      color: inherit;
    }
  }
`;

const Content = styled.div`
  padding: 0 32px;
`;

export const ExportWrap = styled.div`
  margin: 0 0 0 auto;
`;

export default PriceList;
