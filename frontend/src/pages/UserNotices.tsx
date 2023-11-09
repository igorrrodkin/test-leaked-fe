import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import NoFound from '@/components/NoFound';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { getNoticesAction } from '@/store/actions/noticesActions';

import { INotice } from '@/store/reducers/notices';

import { selectNotices } from '@/store/selectors/noticesSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import convertTimestamp from '@/utils/convertTimestamp';

const statuses = ['PENDING', 'SENT'];
const limits = [20, 50, 100];

const UserNotices = () => {
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState(null);
  const [statusRef, isStatusVisible, toggleIsStatusVisible] = useOnClickOutside<HTMLDivElement>();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);

  const notices = useSelector(selectNotices) || [];

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getNoticesAction());
  }, []);

  const setDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const noticesWithAppliedFilters = useMemo(
    () => notices
      .filter((notice) => {
        if (!search) return true;

        const regexp = new RegExp(`.*${search.toLowerCase()}.*`);
        return (
          regexp.test(notice.subject.toLowerCase())
            || regexp.test(notice.message.toLowerCase())
        );
      })
      .filter((notice) => {
        if (!startDate || !endDate) return true;

        const orderDate = new Date(+notice.startDate);
        return orderDate >= startDate && orderDate <= endDate;
      })
      .filter((notice) => {
        if (status === null) return true;

        const isActive = notice.isActive ? statuses[0] : statuses[1];

        return isActive === status;
      }),
    [search, startDate, endDate, status, notices],
  );

  const maxPages = Math.ceil(noticesWithAppliedFilters.length / limits[limit]);
  const calculatedOffset = maxPages > 1 ? offset : 0;
  const filteredNotices: INotice[] = [];

  if (maxPages >= 1) {
    for (
      let i = calculatedOffset * limits[limit];
      i < calculatedOffset * limits[limit] + limits[limit];
      i++
    ) {
      if (noticesWithAppliedFilters[i]) {
        filteredNotices.push(noticesWithAppliedFilters[i]);
      }
    }
  }

  const isFiltered = (startDate && endDate) || status;

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">Notices</PageTitle>
          <p>Manage notices in this page</p>
        </div>
      </PageHeader>
      <Content>
        <div>
          <Filters
            search={{
              searchValue: search,
              setSearchValue: setSearch,
              placeholder: 'Search subject/message here',
              clear: () => setSearch(''),
            }}
            datepicker={{
              startDate,
              endDate,
              setDates,
              makeItLast: true,
            }}
            filters={[
              {
                ref: statusRef,
                name: 'Status',
                value: status === null ? null : status,
                setValue: setStatus,
                values: statuses,
                isApplied: !!status,
                isDropdownVisible: isStatusVisible,
                toggleIsVisible: toggleIsStatusVisible,
                normalizeValue: (v: string) => v.replaceAll('_', ' ').toLowerCase(),
                containLargeValues: true,
              },
            ]}
          />
          {filteredNotices.length ? (
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Start time</th>
                    <th>End time</th>
                    <th>Status</th>
                  </tr>
                </THead>
                <TBody>
                  {filteredNotices.map((notice, i) => (
                    <TRow key={i}>
                      <th>{notice.subject}</th>
                      <th>{notice.message}</th>
                      <th>{convertTimestamp(notice.startDate, true)}</th>
                      <th>
                        {notice.endDate
                          ? convertTimestamp(notice.endDate, true)
                          : '-'}
                      </th>
                      <th>
                        <Status isActive={notice.isActive}>
                          {notice.isActive ? 'SENT' : 'PENDING'}
                        </Status>
                      </th>
                    </TRow>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          ) : (
            <NoFound />
          )}
        </div>
        {filteredNotices.length ? (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={
              search || isFiltered
                ? noticesWithAppliedFilters.length
                : notices.length
            }
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
        ) : (
          ''
        )}
      </Content>
    </PageContainer>
  );
};

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 32px 32px;
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
  padding: 0 32px;
`;

const TableWrapper = styled.div`
  margin-bottom: 1rem;
  overflow-x: auto;
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
    background-color: #fff;

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

const Status = styled.span<{ isActive: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;

  ${({ isActive }) => (isActive
    ? css`
          color: var(--primary-green-color);
          background-color: var(--primary-green-background-color);
        `
    : css`
          color: #dbaa00;
          background-color: #fbf4e4;
        `)}
`;

export default UserNotices;
