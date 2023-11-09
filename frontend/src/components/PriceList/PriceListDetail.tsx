import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import ExportIcon from '@/assets/icons/ExportIcon';

import Loader from '@/components/Loader';
import PricesTable from '@/components/PriceList/PricesTable';

import { ExportWrap } from '@/pages/PriceList';
import { ExportCSV } from '@/pages/Reporting';

import {
  getPriceListByIdAction,
  priceListActions,
} from '@/store/actions/priceListActions';

import { IPriceListCsv, Product, Roles } from '@/store/reducers/user';

import { selectPriceListDetail } from '@/store/selectors/priceListSelector';
import { selectUser } from '@/store/selectors/userSelectors';

import convertTimestamp from '@/utils/convertTimestamp';
import getCsvFile from '@/utils/getCsvFile';

const PriceListDetail = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);
  const priceList = useSelector(selectPriceListDetail);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [csvFilteredPriceList, setCsvFilteredPriceList] = useState<Product[]>(
    priceList?.priceList || [],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) getData();

    return () => dispatch(priceListActions.setPriceListDetail(null));
  }, [id]);

  const getData = async () => {
    try {
      await dispatch(getPriceListByIdAction(+id!));
    } catch (e) {
      navigate('/notFound', {
        replace: true,
        state: {
          goBack: '/price-lists',
        },
      });
    }
  };

  const handleExportCSV = async () => {
    if (!priceList?.priceList) return;

    const data = [
      ...priceList.priceList.map((p) => ({
        Collection: p.collection,
        Supplier: p.supplier,
        'Search Type': p.searchType,
        Description: p.description,
        'Product Code': p.productCode,
        'Price ex GST': (Math.round(+p.priceExGST) / 100).toFixed(2),
        GST: (Math.round(+p.GST) / 100).toFixed(2),
        'Price incl GST': (Math.round(+p.priceInclGST) / 100).toFixed(2),
      })),
    ] as IPriceListCsv[];

    const fileName = `${priceList?.priceListName.replaceAll(
      ' ',
      '',
    )}_${convertTimestamp(new Date().getTime()).toString()}`;

    getCsvFile(data, fileName);
  };

  return priceList ? (
    <>
      <NavLineContainer>
        <StyledArrowBackIcon onClick={() => navigate(-1)} />
        <NavLine>
          <NavItem onClick={() => navigate(-1)}>Price Lists</NavItem>
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

export default PriceListDetail;
