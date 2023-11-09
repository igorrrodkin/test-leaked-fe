import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import {
  getPriceListsByOrganisationAction,
  priceListActions,
} from '@/store/actions/priceListActions';

import { IFullPriceListDetail } from '@/store/reducers/user';

import { selectOrganisationPriceLists } from '@/store/selectors/priceListSelector';

import useInput from '@/hooks/useInput';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import doSearch from '@/utils/search';
import { sort, SortOrder, SortType } from '@/utils/sort';

import { AppDispatch } from '@/store';

interface Props {
  organisationId: number;
}

const limits = [20, 50, 100];

const OrganisationPriceLists: React.FC<Props> = ({ organisationId }) => {
  const [isLoading, setIsLoading] = useToggle(true);
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [limit, setLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  const priceLists = useSelector(selectOrganisationPriceLists);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    getData();

    return () => {
      dispatch(priceListActions.setOrganisationPriceLists([]));
    };
  }, []);

  const getData = async () => {
    setIsLoading(true);
    await dispatch(getPriceListsByOrganisationAction(organisationId));
    setIsLoading(false);
  };

  const submitDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    setOffset(0);
  };

  const today = useMemo(() => moment().endOf('day').valueOf(), []);

  const priceListsWithActive = useMemo(() => {
    const index = priceLists.findIndex((priceList) => priceList.isActive && +priceList.effectiveFromDate <= today);
    const onlyOneActivePriceLists = priceLists.map((priceList, i) => ({ ...priceList, isActive: i === index }));
    return onlyOneActivePriceLists;
  }, [priceLists]);

  const fullPriceLists = useMemo(
    () => sort(priceListsWithActive, (item) => item.effectiveFromDate, SortOrder.Descending, SortType.Number)
      .reduceRight((acc, priceList, i, allPriceLists) => [
        ...acc,
        {
          ...priceList,
          effectiveToDate: allPriceLists[i - 1]?.effectiveFromDate,
        },
      ], [] as IFullPriceListDetail[])
      .reverse(),
    [priceListsWithActive],
  );

  const priceListsWithAppliedFilters = useMemo(
    () => doSearch(fullPriceLists, search, (priceList) => priceList.priceListName)
      .filter((priceList) => priceList.effectiveFromDate >= (startDate || '0') && (priceList.effectiveFromDate) <= (endDate || '999999999999')),
    [search, startDate, endDate, fullPriceLists],
  );

  const maxPages = Math.ceil(
    priceListsWithAppliedFilters.length / limits[limit],
  );

  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredPriceLists: IFullPriceListDetail[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i++
    ) {
      if (priceListsWithAppliedFilters[i]) {
        filteredPriceLists.push(priceListsWithAppliedFilters[i]);
      }
    }
  }

  return (
    <OrganisationPriceListsStyled>
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">Price Lists</PageTitle>
          <p>Manage Pricing in this page</p>
        </div>
      </PageHeader>
      {!isLoading ? (
        priceLists.length ? (
          <Content>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Enter Price List ID here',
                clear: () => setSearch(''),
              }}
              datepicker={{
                title: 'Effective From Date',
                startDate,
                endDate,
                setDates: submitDates,
                isForMatters: true,
              }}
            />
            {filteredPriceLists.length ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>PRICE LIST ID</th>
                      <th>DESCRIPTION</th>
                      <th>EFFECTIVE FROM</th>
                      <th>EFFECTIVE TO</th>
                    </tr>
                  </THead>
                  <TBody>
                    {filteredPriceLists.map((item) => (
                      <TRow
                        key={item.id + item.priceListName}
                        onClick={() => navigate(`/price-lists/${item.priceListId}`)}
                      >
                        <th>{item.priceListName}</th>
                        <th>{item.description}</th>
                        <th>{convertTimestamp(item.effectiveFromDate, true)}</th>
                        <th>
                          {item.effectiveToDate
                            ? convertTimestamp(item.effectiveToDate, true)
                            : '-'}
                        </th>
                      </TRow>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )}
            {!!filteredPriceLists.length && (
              <Pagination
                changePage={setOffset}
                currentPage={calculatedOffset}
                maxPages={maxPages}
                maxElements={priceListsWithAppliedFilters.length}
                limits={limits}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </Content>
        ) : (
          'Not found'
        )
      ) : (
        <Loader />
      )}
    </OrganisationPriceListsStyled>
  );
};

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 0 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);

  p {
    color: rgba(17, 24, 39, 0.7);
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
`;

const TableWrapper = styled.div`
  margin-bottom: 16px;
  flex: 1;
  overflow-x: auto;
`;

const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
  }
`;

const THead = styled.thead`
  background-color: #f9f9f9;

  th {
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
    text-transform: uppercase;
    text-align: left;

    :first-child {
      padding-left: 18px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const TBody = styled.tbody`
  th {
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
`;

const TRow = styled.tr`
  cursor: pointer;

  th {
    padding-right: 25px;
    max-width: 300px;
    background-color: #fff;
    white-space: normal;

    :first-child {
      padding-left: 18px;
    }
  }

  :hover th {
    background-color: #f9f9f9;
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
`;

const OrganisationPriceListsStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

export default OrganisationPriceLists;
