import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import styled, { css } from 'styled-components';

import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import {
  Content, PageHeader, Table, TableWrapper, TBody, THead, TRow,
} from '@/pages/Notices';

import { getApiKeysAction } from '@/store/actions/apiKeyActions';

import { IApiKey } from '@/store/reducers/apiKey';

import { selectApiKeys } from '@/store/selectors/apiKeySelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import isNumber from '@/utils/isNumber';

import { AppDispatch } from '@/store';

const statuses = ['Active', 'Revoked'];
const limits = [20, 50, 100];

const ApiKeys = () => {
  const [isLoading, toggleIsLoading] = useToggle(true);
  const [organisations, setOrganisations] = useState<string[] | null>(null);
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState(null);
  const [organisation, setOrganisation] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [
    organisationsRef,
    isOrganisationsVisible,
    toggleIsOrganisationsVisible,
  ] = useOnClickOutside<HTMLDivElement>();
  const [
    statusesRef,
    isStatusesVisible,
    toggleIsStatusesVisible,
  ] = useOnClickOutside<HTMLDivElement>();

  const apiKeys = useSelector(selectApiKeys);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getApiKeys();
  }, []);

  useEffect(() => {
    if (apiKeys.length) {
      setOrganisations([...new Set(apiKeys.map((el) => el.orgName))]);
    }
  }, [apiKeys]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [offset]);

  const getApiKeys = async () => {
    try {
      await dispatch(getApiKeysAction());
      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const submitDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    setOffset(0);
  };

  const keysWithAppliedFilters = useMemo(
    () => apiKeys
      .filter((key) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return regexp.test(key.apiKey.slice(-4).toLowerCase());
      })
      .filter((key) => {
        if (!startDate || !endDate) return true;

        const createdDate = new Date(key.lastUsedAt);
        return createdDate >= startDate && createdDate <= endDate;
      })
      .filter((key) => {
        if (status === null) return true;

        const isActive = key.isRevoked ? statuses[1] : statuses[0];

        return isActive === status;
      })
      .filter((key) => {
        if (organisation === null) return true;

        return key.orgName === organisation && organisations?.includes(key.orgName);
      }),
    [search, startDate, endDate, status, organisation, apiKeys],
  );

  const maxPages = Math.ceil(keysWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredKeys: IApiKey[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i += 1
    ) {
      if (keysWithAppliedFilters[i]) {
        filteredKeys.push(keysWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = (startDate && endDate) || status || search || organisation;

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">API Keys</PageTitle>
          <p>Manage API Keys in this page</p>
        </div>
      </PageHeader>
      {!isLoading ? (
        <Content>
          <div>
            <Filters
              search={{
                searchValue: search,
                setSearchValue: setSearch,
                placeholder: 'Enter last 4 characters of API Key',
                clear: () => setSearch(''),
              }}
              datepicker={{
                title: 'Last Used At',
                startDate,
                endDate,
                setDates: submitDates,
              }}
              filters={[
                {
                  name: 'Status',
                  value: status || '',
                  setValue: setStatus,
                  values: statuses,
                  isApplied: !!status,
                  ref: statusesRef,
                  isDropdownVisible: isStatusesVisible,
                  toggleIsVisible: toggleIsStatusesVisible,
                  containLargeValues: true,
                },
                {
                  name: 'Organisations',
                  value: organisation || '',
                  setValue: setOrganisation,
                  values: organisations || [],
                  isApplied: !!organisation,
                  ref: organisationsRef,
                  isUseSearch: true,
                  isSortValeus: true,
                  isDropdownVisible: isOrganisationsVisible,
                  toggleIsVisible: toggleIsOrganisationsVisible,
                  containLargeValues: true,
                },
              ]}
            />
            {filteredKeys.length ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>ORGANISATION</th>
                      <th>API KEY</th>
                      <th>CREATED AT</th>
                      <th>LAST USED</th>
                      <th>STATUS</th>
                      <th>USAGE</th>
                      <th>LIMIT</th>
                    </tr>
                  </THead>
                  <TBody>
                    {filteredKeys.map((el) => (
                      <TRow key={el.apiKey}>
                        <th>{el.orgName}</th>
                        <th>{el.apiKey}</th>
                        <th>{`${moment(el.createdAt).format('YYYY/MM/DD hh:mm A')}`}</th>
                        <th>{el.lastUsedAt ? `${moment(el.lastUsedAt).format('YYYY/MM/DD hh:mm A')}` : '-'}</th>
                        <Status
                          isActive={!el.isRevoked}
                        >
                          {el.isRevoked ? 'Revoked' : 'Active'}
                        </Status>
                        <th>{isNumber(el.usage) ? el.usage : '-'}</th>
                        <th>{el.limit || '-'}</th>
                      </TRow>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )}
          </div>
          {!!filteredKeys.length && (
            <Pagination
              changePage={setOffset}
              currentPage={calculatedOffset}
              maxPages={maxPages}
              maxElements={
                search || isFiltered
                  ? keysWithAppliedFilters.length
                  : apiKeys.length
              }
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </Content>
      ) : (
        <Loader />
      )}
    </PageContainer>
  );
};

const Status = styled.th<{ isActive: boolean }>`
  color: var(--primary-green-color);
  
  ${({ isActive }) => !isActive && css`
    color: var(--primary-red-color);
  `}
`;

export default ApiKeys;
