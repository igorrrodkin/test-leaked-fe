import {
  ChangeEvent,
  Dispatch,
  FC, SetStateAction, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';
import styled, { css } from 'styled-components';

import LoadingContainer from '@/components/LoadingContainer';
import NoFound from '@/components/NoFound';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { ILog } from '@/store/reducers/logs';
import { IBaseOrganisationsInfo, IOrganisation } from '@/store/reducers/organisations';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import convertTimestamp from '@/utils/convertTimestamp';
import { ILogsInitialQuery, setLogsQuery } from '@/utils/setLogsQuery';

const limits = [20, 50, 100];

interface LogsListPageProps {
  logs: ILog[] | null;
  users: IOrganisationUser[];
  organisations: IBaseOrganisationsInfo[];
  logsTotal: number;
  initialQuery: ILogsInitialQuery;
  isLogsLoading: boolean;
}

const LogsListPage: FC<LogsListPageProps> = ({
  logs,
  users,
  organisations,
  logsTotal,
  initialQuery,
  isLogsLoading,
}) => {
  const navigate = useNavigate();

  const user = useSelector(selectUser)!;

  const [search, setSearch] = useInput(initialQuery.searchInput || '');
  const [status, setStatus] = useInput(initialQuery.status || '');
  const [vendorStatus, setVendorStatus] = useInput(initialQuery.vendorStatus || '');

  const [startDay, setStartDay] = useState<Date | undefined>(
    initialQuery.startDate ? new Date(+initialQuery.startDate) : undefined,
  );
  const [endDay, setEndDay] = useState<Date | undefined>(
    initialQuery.endDate ? new Date(+initialQuery.endDate) : undefined,
  );
  const [selectedUser, setSelectedUser] = useState<IOrganisationUser | null>(
    () => {
      if (initialQuery.userId === undefined) {
        return null;
      }
      return users.find(({ id }) => +initialQuery.userId! === +id) || null;
    },
  );
  const [selectedOrganisation, setSelectedOrganisation] = useState<IBaseOrganisationsInfo | null>(() => {
    if (initialQuery.organisationId === undefined) {
      return null;
    }
    return (
      organisations.find(({ id }) => +initialQuery.organisationId! === +id)
        || null
    );
  });

  const [offset, setOffset] = useState(initialQuery.pageNumber ? initialQuery.pageNumber - 1 : 0);
  const [limit, setLimit] = useState(() => {
    if (!initialQuery.pageSize) {
      return 0;
    }
    const index = limits.findIndex((l) => +initialQuery.pageSize! === l);
    return index !== -1 ? index : 0;
  });

  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();
  const [statusDebounce, setStatusDebounce] = useState<NodeJS.Timeout>();
  const [vendorStatusDebounce, setVendorStatusDebounce] = useState<NodeJS.Timeout>();

  useEffect(() => {
    setSearch(initialQuery.searchInput || '');
    setStatus(initialQuery.status || '');
    setVendorStatus(initialQuery.vendorStatus || '');
    setStartDay(
      initialQuery.startDate ? new Date(+initialQuery.startDate) : undefined,
    );
    setEndDay(
      initialQuery.endDate ? new Date(+initialQuery.endDate) : undefined,
    );
    setSelectedUser(() => {
      if (initialQuery.userId === undefined) {
        return null;
      }
      return users.find(({ id }) => +initialQuery.userId! === +id) || null;
    });
    setSelectedOrganisation(() => {
      if (initialQuery.organisationId === undefined) {
        return null;
      }
      return (
        organisations.find(({ id }) => +initialQuery.organisationId! === +id)
        || null
      );
    });
  }, [initialQuery]);

  const [usersRef, isUsersVisible, toggleIsUsersVisible] = useOnClickOutside<HTMLDivElement>();
  const [
    organisationRef,
    isOrganisationsVisible,
    toggleIsOrganisationsVisible,
  ] = useOnClickOutside<HTMLDivElement>();

  const maxPages = Math.ceil(logsTotal / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;

  const handleSearch = (s: string) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    setSearch(s);
    setOffset(0);

    const debounceValue = setTimeout(() => {
      const newQuery = setLogsQuery({
        offsetQuery: 0,
        limitQuery: limits[limit],
        searchInputQuery: s.replaceAll('=', '0x3D'),
        startDayQuery: startDay,
        endDateQuery: endDay,
        statusQuery: status,
        vendorStatusQuery: vendorStatus,
        userIdQuery: selectedUser?.id,
        organisationIdQuery: selectedOrganisation?.id,
      });

      navigate({ search: base64.encode(newQuery) });
    }, 500);

    setSearchDebounce(debounceValue);
  };

  const handleSelectOrganisation = (orgItem: IOrganisation) => {
    setSelectedOrganisation(orgItem);
    setOffset(0);

    const newQuery = setLogsQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchInputQuery: search.replaceAll('=', '0x3D'),
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      vendorStatusQuery: vendorStatus,
      userIdQuery: selectedUser?.id,
      organisationIdQuery: orgItem?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handleSelectStatus = (event: ChangeEvent<HTMLInputElement>) => {
    if (statusDebounce) {
      clearTimeout(statusDebounce);
    }

    setStatus(event.target.value);
    setOffset(0);

    const debounceValue = setTimeout(() => {
      const newQuery = setLogsQuery({
        offsetQuery: 0,
        limitQuery: limits[limit],
        searchInputQuery: search.replaceAll('=', '0x3D'),
        startDayQuery: startDay,
        endDateQuery: endDay,
        statusQuery: event.target.value,
        vendorStatusQuery: vendorStatus,
        userIdQuery: selectedUser?.id,
        organisationIdQuery: selectedOrganisation?.id,
      });

      navigate({ search: base64.encode(newQuery) });
    }, 500);

    setStatusDebounce(debounceValue);
  };

  const handleSelectVendorStatus = (event: ChangeEvent<HTMLInputElement>) => {
    if (vendorStatusDebounce) {
      clearTimeout(vendorStatusDebounce);
    }

    setVendorStatus(event.target.value);
    setOffset(0);

    const debounceValue = setTimeout(() => {
      const newQuery = setLogsQuery({
        offsetQuery: 0,
        limitQuery: limits[limit],
        searchInputQuery: search.replaceAll('=', '0x3D'),
        startDayQuery: startDay,
        endDateQuery: endDay,
        statusQuery: status,
        vendorStatusQuery: event.target.value,
        userIdQuery: selectedUser?.id,
        organisationIdQuery: selectedOrganisation?.id,
      });

      navigate({ search: base64.encode(newQuery) });
    }, 500);

    setVendorStatusDebounce(debounceValue);
  };

  const setDates = (start?: Date, end?: Date) => {
    setStartDay(start);
    setEndDay(end);
    setOffset(0);

    const newQuery = setLogsQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchInputQuery: search.replaceAll('=', '0x3D'),
      startDayQuery: start,
      endDateQuery: end,
      statusQuery: status,
      vendorStatusQuery: vendorStatus,
      userIdQuery: selectedUser?.id,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handleSelectOrgUser = (userObj: IOrganisationUser) => {
    setSelectedUser(userObj);
    toggleIsUsersVisible(false);
    setOffset(0);

    const newQuery = setLogsQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchInputQuery: search.replaceAll('=', '0x3D'),
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      vendorStatusQuery: vendorStatus,
      userIdQuery: userObj?.id,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handlePageChange = (item: number) => {
    setOffset(item);

    const newQuery = setLogsQuery({
      offsetQuery: item,
      limitQuery: limits[limit],
      searchInputQuery: search.replaceAll('=', '0x3D'),
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      vendorStatusQuery: vendorStatus,
      userIdQuery: selectedUser?.id,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handlePageSize = (item: number) => {
    setLimit(item);
    setOffset(0);

    const newQuery = setLogsQuery({
      offsetQuery: 0,
      limitQuery: limits[item],
      searchInputQuery: search.replaceAll('=', '0x3D'),
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      vendorStatusQuery: vendorStatus,
      userIdQuery: selectedUser?.id,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  return (
    <FiltersLogsTableStyled>
      <PageHeader>
        <PageTitle marginBottom="16px">Logs</PageTitle>
        <PageText>Manage logs in this page</PageText>
      </PageHeader>
      <FiltersWrapp>
        <Filters
          search={{
            searchValue: search,
            placeholder: 'Search Order ID / Api Key / Query / Path / Log ID',
            setSearchValue: (evt) => {
              handleSearch(evt.target.value.replace('&', ''));
            },
            clear: () => handleSearch(''),
          }}
          datepicker={{
            startDate: startDay,
            endDate: endDay,
            setDates,
          }}
          filters={[
            {
              ref: organisationRef,
              name: 'Organisation',
              value: selectedOrganisation?.name || '',
              setValue: handleSelectOrganisation,
              values: organisations,
              keyForValue: 'name',
              isApplied: !!selectedOrganisation,
              isDropdownVisible: isOrganisationsVisible,
              toggleIsVisible: toggleIsOrganisationsVisible,
              containLargeValues: true,
              isAdmin: true,
              isUseSearch: true,
              isSortValeus: true,
            },
            ...(user?.userSettings.general.isShowOwnOrders
              ? []
              : [
                {
                  ref: usersRef,
                  name: 'User',
                  value: selectedUser?.name || '',
                  setValue: handleSelectOrgUser,
                  values: users,
                  keyForValue: 'name',
                  isApplied: !!selectedUser,
                  isDropdownVisible: isUsersVisible,
                  toggleIsVisible: toggleIsUsersVisible,
                  containLargeValues: true,
                },
              ]),
          ]}
        />
        <StyledInput>
          <input
            value={status}
            onChange={handleSelectStatus}
            placeholder="Status code"
          />
        </StyledInput>
        <StyledInput>
          <input
            value={vendorStatus}
            onChange={handleSelectVendorStatus}
            placeholder="Vendor Status code"
          />
        </StyledInput>
      </FiltersWrapp>
      <Content>
        <LoadingContainer isLoading={isLogsLoading}>
          {logs && logs.length ? (
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Query</th>
                    <th>Status</th>
                    <th>Vendor status</th>
                    <th>Date</th>
                    <th>User</th>
                    <th>Order id</th>
                    <th>Organization</th>
                    <th>Api key</th>
                  </tr>
                </THead>
                <TBody>
                  {logs.map((log) => {
                    const apiKey = log.apiKey || '';

                    return (
                      <TRow key={log.id} onClick={() => navigate(`/logs/${log.logId}`)}>
                        <td title={log.method}>{log.method}</td>
                        <td title={log.path}>{log.path}</td>
                        <td title={log.query}>{log.query}</td>
                        <td title={`${log.statusCode}`}>{log.statusCode}</td>
                        <td title={`${log.vendorStatus}`}>{log.vendorStatus}</td>
                        <td title={`${convertTimestamp(log.date)}`}>{convertTimestamp(log.date)}</td>
                        <td title={`${log.username}`}>{log.username}</td>
                        <td title={log.orderId}>{log.orderId}</td>
                        <td title={`${log.orgName}`}>{log.orgName}</td>
                        <td title={apiKey.slice(-8)}>
                          {apiKey.slice(-8)}
                        </td>
                      </TRow>
                    );
                  })}
                </TBody>
              </Table>
            </TableWrapper>
          ) : (
            <NoFound />
          )}
        </LoadingContainer>
        {logs?.length ? (
          <Pagination
            changePage={handlePageChange as Dispatch<SetStateAction<number>>}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={logsTotal}
            limits={limits}
            limit={limit}
            setLimit={handlePageSize as Dispatch<SetStateAction<number>>}
          />
        ) : null}
      </Content>
    </FiltersLogsTableStyled>
  );
};

const FiltersLogsTableStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);
`;

const PageText = styled.p`
  color: rgba(17, 24, 39, 0.7);
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
`;

const TableWrapper = styled.div<{ tableTotalsSpace?: number }>`
  margin-bottom: 1rem;
  overflow-x: auto;

  // to restrict Reports' table height
  ${({ tableTotalsSpace }) => tableTotalsSpace
    && css`
      /* Fix table head */
      overflow: auto;
      height: ${tableTotalsSpace}px;
      min-height: 400px;

      th {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: #f9f9f9;
      }

      /* Just common table stuff. */
      table {
        border-collapse: collapse;
        width: 100%;
        overflow: auto;
      }
      th,
      td {
        min-width: 120px;
      }
    `}
`;

const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
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
    white-space: nowrap;

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
  th,
  td {
    height: 64px;
    max-width: 140px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const TRow = styled.tr`
  cursor: pointer;

  th,
  td {
    padding-right: 25px;
    background-color: #fff;

    :first-child {
      padding-left: 18px;
    }
  }

  :hover th,
  :hover td {
    background-color: #f9f9f9;
  }

  :last-child {
    th:first-child,
    td:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }

`;

const FiltersWrapp = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 32px;

  & > div:first-child {
    flex: 1;
  }
`;

const StyledInput = styled.div`
  position: relative;
  width: 115px;
  height: 38px;
  margin-bottom: 1rem;

  input {
    padding: 13px 16px;
    width: 100%;
    height: 38px;
    border: 1px solid rgba(156, 163, 175, 0.6);
    border-radius: 5px;
    font-size: 12px;
    background-color: #fff;
    color: var(--primary-dark-color);

    ::placeholder {
      color: rgba(17, 24, 39, 0.35);
    }

    :focus {
      outline: 2px solid var(--primary-blue-color);
    }
  }
`;

export default LogsListPage;
