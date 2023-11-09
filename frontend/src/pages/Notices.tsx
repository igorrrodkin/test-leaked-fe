import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import AddIcon from '@/assets/icons/AddIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import EditIcon from '@/assets/icons/EditIcon';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import NoticeModalWindow from '@/components/Notices/NoticeModalWindow';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import {
  deleteNoticeAction,
  getActiveNoticesAction,
  getNoticesAction,
} from '@/store/actions/noticesActions';
import { userActions } from '@/store/actions/userActions';

import { INotice } from '@/store/reducers/notices';
import { PopupTypes } from '@/store/reducers/user';

import { selectNotices } from '@/store/selectors/noticesSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import convertTimestamp from '@/utils/convertTimestamp';
import customScrollCss from '@/utils/customScrollCss';

const statuses = ['PENDING', 'SENT'];
const limits = [20, 50, 100];

const Notices = () => {
  const [isNewNoticeVisible, toggleIsNewNoticeVisible] = useToggle();
  const [editableNotice, setEditableNotice] = useState<INotice | undefined>();
  const [deleteNotice, setDeleteNotice] = useState<INotice>();
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState(null);
  const [statusRef, isStatusVisible, toggleIsStatusVisible] = useOnClickOutside<HTMLDivElement>();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [isLoading, toggleIsLoading] = useToggle(true);

  const notices = useSelector(selectNotices) || [];

  const dispatch = useDispatch<any>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      await dispatch(getNoticesAction());
      toggleIsLoading(false);
    } catch (e) {
      toggleIsLoading(false);
    }
  };

  const setDates = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const deleteNoticeHandler = async (id: number) => {
    try {
      if (isLoading) return;

      toggleIsLoading(true);

      await dispatch(deleteNoticeAction(id));
      await dispatch(getActiveNoticesAction());

      toggleIsLoading(false);
      setDeleteNotice(undefined);
      dispatch(
        userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success',
          additionalText: 'Notice has been deleted',
        }),
      );
    } catch (e: any) {
      toggleIsLoading(false);
    }
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

        const isActive = notice.isActive ? statuses[1] : statuses[0];

        return isActive === status;
      })
      .sort((a, b) => {
        if (a.startDate === b.startDate) {
          return +(a.endDate || 0) < +(b.endDate || 0) ? -1 : 1;
        }
        return +b.startDate < +a.startDate ? -1 : 1;
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
      i += 1
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
        <NewNotice onClick={toggleIsNewNoticeVisible}>
          <AddIcon />
          New Notice
        </NewNotice>
      </PageHeader>
      {!isLoading ? (
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
                      <th>Actions</th>
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
                        <ActionsCell>
                          <ActionWrapper
                            onClick={() => {
                              toggleIsNewNoticeVisible(true);
                              setEditableNotice(notice);
                            }}
                          >
                            <EditIcon />
                          </ActionWrapper>
                          <ActionWrapper
                            onClick={() => setDeleteNotice(notice)}
                          >
                            <DeleteIcon />
                          </ActionWrapper>
                        </ActionsCell>
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
      ) : (
        <Loader />
      )}
      {isNewNoticeVisible && (
        <NoticeModalWindow
          close={() => {
            toggleIsNewNoticeVisible(false);
            setEditableNotice(undefined);
          }}
          notice={editableNotice}
        />
      )}
      {deleteNotice && (
        <Modal closeModal={() => setDeleteNotice(undefined)}>
          <DeactivateModal
            title="Delete Notice?"
            subTitle={`Are you sure you want to delete "<b>${deleteNotice.subject}</b>" notice?`}
            cancelButton={{
              onCancel: () => setDeleteNotice(undefined),
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: () => deleteNoticeHandler(deleteNotice.id),
              name: 'Yes',
              isLoading,
              style: {
                isRedButton: true,
                style: { width: '90px', height: '48px', fontSize: '16px' },
              },
            }}
          />
        </Modal>
      )}
    </PageContainer>
  );
};

export const PageHeader = styled.div`
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

const NewNotice = styled(Button)`
  grid-gap: 8px;
  height: 50px;
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
`;

export const TableWrapper = styled.div<{ tableTotalsSpace?: number }>`
  margin-bottom: 1rem;
  overflow-x: auto;

  // to restrict Reports' table height
  ${({ tableTotalsSpace }) => tableTotalsSpace
    && css`
      /* Fix table head */
      overflow: auto;
      height: ${tableTotalsSpace}px;
      min-height: 400px;

      /* ${customScrollCss} */

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

export const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
`;

export const THead = styled.thead`
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

export const TBody = styled.tbody`
  th,
  td {
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    text-align: left;
  }
`;

export const TRow = styled.tr`
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

export const TTh = styled.th<{ isPreLine?: boolean }>`
  white-space: ${({ isPreLine }) => (isPreLine ? 'pre-line' : 'normal')};
  max-width: 200px;
`;

export const TTd = styled.td<{ isPreLine?: boolean }>`
  white-space: ${({ isPreLine }) => (isPreLine ? 'pre-line' : 'normal')};
  max-width: 200px;
`;

export const ActionsCell = styled.th`
  display: flex;
  align-items: center;
  grid-gap: 12px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: #f1efe9;
  cursor: pointer;

  :hover {
    background-color: #e1dfd9;
  }
`;

export default Notices;
