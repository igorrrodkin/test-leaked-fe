import React, {
  RefObject, useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import scrollUpIcon from '@/assets/icons/arrow-left.svg';
import scrollDownIcon from '@/assets/icons/arrow-right.svg';
import ExportIcon from '@/assets/icons/ExportIcon';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Filters from '@/components/Table/Filters';

import { Content, PageHeader } from '@/pages/Notices';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import { getReportsAction, reportsActions } from '@/store/actions/reportsActions';
import {
  getSysAdminUsersAction,
  getUsersAction,
} from '@/store/actions/usersActions';

import { IOrganisation } from '@/store/reducers/organisations';
import { IReport } from '@/store/reducers/reports';
import { OrganizationUser, Roles } from '@/store/reducers/user';

import { selectActiveNotices } from '@/store/selectors/noticesSelector';
import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import {
  selectIsReportsLoading,
  selectReports,
} from '@/store/selectors/reportsSelector';
import { selectUser } from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import convertTimestamp from '@/utils/convertTimestamp';
import dropdownSelectHelper, {
  ID_FOR_DROPDOWN_SELECT,
} from '@/utils/dropdownSelectHelper';
import formatTotal from '@/utils/formatTotal';
import getCsvFile from '@/utils/getCsvFile';

import { AppDispatch } from '@/store';

interface IOption {
  option: BillingOptions;
  value: number;
  period: 'd' | 'y';
}

export interface ICsvObj {
  'ORDER ID': string;
  'ORDER DATE': string;
  ORGANISATION: string;
  USER: string;
  MATTER: string;
  SERVICE: string;
  'SEARCH DETAILS': string;
  'TOTAL (EX. GST)': string;
  GST: string;
  'TOTAL (INC. GST)': string;
}

const tableHeaderLabels = [
  'DATE COMPLETED',
  'ORDER ID',
  'ORDER DATE',
  'ORGANISATION',
  'USER',
  'MATTER',
  'SERVICE',
  'SEARCH DETAILS',
  'TOTAL (ex. GST)',
  'GST',
  'TOTAL (inc. GST)',
];
const minHeight = 400;
const paddingBottom = 150;

export enum BillingOptions {
  Today = 'Today',
  Yesterday = 'Yesterday',
  Last7days = 'Last 7 days',
  Last14days = 'Last 14 days',
  Last28days = 'Last 28 days',
  Last30days = 'Last 30 days',
  Last60days = 'Last 60 days',
  Last90days = 'Last 90 days',
  Last180days = 'Last 180 days',
  CurrentCalendarYear = 'Current calendar year',
  LastCalendarYear = 'Last calendar year',
  CustomPeriod = 'Custom Period',
}

const BILLING_OPTIONS = [
  { option: BillingOptions.Today, value: 0, period: 'd' },
  { option: BillingOptions.Yesterday, value: 1, period: 'd' },
  { option: BillingOptions.Last7days, value: 6, period: 'd' },
  { option: BillingOptions.Last14days, value: 13, period: 'd' },
  { option: BillingOptions.Last28days, value: 27, period: 'd' },
  { option: BillingOptions.Last30days, value: 29, period: 'd' },
  { option: BillingOptions.Last60days, value: 59, period: 'd' },
  { option: BillingOptions.Last90days, value: 89, period: 'd' },
  { option: BillingOptions.Last180days, value: 179, period: 'd' },
  { option: BillingOptions.CurrentCalendarYear, value: 0, period: 'y' },
  { option: BillingOptions.LastCalendarYear, value: 1, period: 'y' },
  { option: BillingOptions.CustomPeriod, value: -1, period: 'd' },
] as IOption[];

const reportType = [
  { name: 'Billable Orders' },
  { name: 'All Orders' },
];

const ReportingPage = () => {
  const [search, setSearch] = useInput();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [org, setOrg] = useState<IOrganisation | null>(null);
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(
    null,
  );
  const [selectedReportType, setSelectedReportType] = useState<typeof reportType[0] | null>(
    { name: 'Billable Orders' },
  );
  const [billingOption, setBillingOption] = useState<IOption | null>(null);

  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [totalEx, setTotalEx] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [totalInc, setTotalInc] = useState(0);

  const [orgRef, isOrgsVisible, toggleIsOrgsVisible] = useOnClickOutside<HTMLDivElement>();
  const [usersRef, isUsersVisible, toggleIsUsersVisible] = useOnClickOutside<HTMLDivElement>();
  const [billingRef, isBillingVisible, toggleIsBillingVisible] = useOnClickOutside<HTMLDivElement>();
  const [reportTypeRef, isReportTypeVisible, toggleIsReportTypeVisible] = useOnClickOutside<HTMLDivElement>();

  const user = useSelector(selectUser)!;
  const reports = useSelector(selectReports) || null;
  const users = useSelector(selectUsers);
  const organisations = useSelector(selectBaseOrganisationsInfo);
  const isReportsLoading = useSelector(selectIsReportsLoading);

  const notices = useSelector(selectActiveNotices);

  const allUsers = users.map((item) => ({
    ...item,
    name: `${item.firstName} ${item.lastName} ${ID_FOR_DROPDOWN_SELECT}${item.id}`,
  }));

  const organisationsNames = useMemo(() => {
    if (user?.role === Roles.SYSTEM_ADMIN && organisations) {
      return organisations.map((orgItem) => ({
        ...orgItem,
        name: `${orgItem.name}${ID_FOR_DROPDOWN_SELECT}${orgItem.id}`,
      }));
    }
    return [];
  }, [user, organisations]);

  const dispatch = useDispatch<AppDispatch>();

  const [height, setHeight] = useState<number>(minHeight);

  const tableRef = useRef(null) as RefObject<HTMLDivElement>;

  const screenHeight = window.innerHeight;

  useEffect(() => {
    if (tableRef.current) {
      const elementTopPosition = tableRef.current?.offsetTop;

      const calculatedAvailableHeight = screenHeight - elementTopPosition!;

      if (calculatedAvailableHeight <= minHeight) {
        setHeight(minHeight);
        return;
      }

      setHeight(calculatedAvailableHeight - paddingBottom);
    }
  }, [notices, tableRef.current, isSearchClicked]);

  useEffect(() => {
    switch (user.role) {
      case Roles.SYSTEM_ADMIN:
        dispatch(getSysAdminUsersAction());
        return;

      default:
        dispatch(getUsersAction(user.organisations[0].id));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!organisations.length && user?.role === Roles.SYSTEM_ADMIN) dispatch(getBaseOrganisationsInfoAction());
  }, []);

  useEffect(() => {
    if (!reports) return;

    const totalNumber = (key: keyof IReport, arr: IReport[]) => arr.reduce(
      (sum, report) => (!!report[key] && report[key] !== 'NaN' ? sum + +report[key]! : sum),
      0,
    );

    setTotalEx(totalNumber('totalEx', reports));
    setGstTotal(totalNumber('gst', reports));
    setTotalInc(totalNumber('totalInc', reports));
  }, [reports]);

  useEffect(() => {
    dispatch(reportsActions.setReports(null));
  }, [search, startDate, endDate, org?.id, selectedUser, selectedReportType]);

  const setDates = (start?: Date, end?: Date) => {
    if (!start || !end) {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    }

    setStartDate(moment(start).startOf('d').toDate());
    setEndDate(moment(end).endOf('d').toDate());

    setIsSearchClicked(false);
  };

  const selectOrgUser = (userObj: OrganizationUser) => {
    setSelectedUser(userObj);
    toggleIsUsersVisible(false);

    setIsSearchClicked(false);
  };

  const selectReportType = (userObj: OrganizationUser) => {
    setSelectedReportType(userObj);
    toggleIsReportTypeVisible(false);

    setIsSearchClicked(false);
  };

  const selectBillingOption = (option: IOption) => {
    if (!option) {
      return;
    }

    switch (option.option) {
      case BillingOptions.Today:
        {
          const start = moment().startOf('d').toDate();
          const end = moment().endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Yesterday:
        {
          const start = moment().subtract(1, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last7days:
        {
          const start = moment().subtract(6, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last14days:
        {
          const start = moment().subtract(13, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last28days:
        {
          const start = moment().subtract(27, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last30days:
        {
          const start = moment().subtract(29, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last60days:
        {
          const start = moment().subtract(59, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last90days:
        {
          const start = moment().subtract(89, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.Last180days:
        {
          const start = moment().subtract(179, 'd').startOf('d').toDate();
          const end = moment().subtract(1, 'd').endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.CurrentCalendarYear:
        {
          const start = moment().startOf('y').toDate();
          const end = moment().endOf('d').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.LastCalendarYear:
        {
          const start = moment().subtract(1, 'y').startOf('y').toDate();
          const end = moment().subtract(1, 'y').endOf('y').toDate();

          setStartDate(start);
          setEndDate(end);
        }
        break;
      case BillingOptions.CustomPeriod:
        break;
      default:
        break;
    }
    setBillingOption(option);
    toggleIsBillingVisible(false);
    setIsSearchClicked(false);
  };

  const selectOrg = (orgItem: IOrganisation) => {
    setOrg(orgItem);

    setIsSearchClicked(false);
  };

  const setValue = (inputVal: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(inputVal);

    setIsSearchClicked(false);
  };

  const handleExportCSV = async () => {
    const data = [
      ...reports!.map((report) => ({
        'ORDER ID': report.orderId,
        'ORDER DATE': convertTimestamp(+report.orderDate, true)
          .split(' \n')
          .join(''),
        ORGANISATION: report.organisation,
        USER: report.user,
        MATTER: report.matter,
        SERVICE: report.service,
        'SEARCH DETAILS': report.searchDetails,
        'TOTAL (EX. GST)': formatTotal(report.totalEx),
        GST: formatTotal(report.gst),
        'TOTAL (INC. GST)': formatTotal(report.totalInc),
      })),
      {
        'ORDER ID': '',
        'ORDER DATE': '',
        ORGANISATION: '',
        USER: '',
        MATTER: '',
        SERVICE: '',
        'SEARCH DETAILS': 'Totals:',
        'TOTAL (EX. GST)': `$${(totalEx / 100).toFixed(2)}`,
        GST: `$${(gstTotal / 100).toFixed(2)}`,
        'TOTAL (INC. GST)': `$${(totalInc / 100).toFixed(2)}`,
      },
    ] as ICsvObj[];

    const fileName = `alts_corp_${convertTimestamp(
      new Date().getTime(),
    ).toString()}`;

    dispatch(reportsActions.setIsReportsLoading(true));
    await getCsvFile(data, fileName);
    dispatch(reportsActions.setIsReportsLoading(false));
  };

  const handleClearInput = () => {
    setIsSearchClicked(false);
    setSearch('');
  };

  const handleSearchClick = () => {
    setIsSearchClicked(true);

    const changedQueries = {
      searchQuery: search,
      startDayQuery: startDate,
      endDateQuery: endDate,
      userIdQuery: selectedUser?.id,
      userReportType: selectedReportType?.name === 'Billable Orders',
      organisationIdQuery:
        user?.role === Roles.SYSTEM_ADMIN
          ? (org ? organisations?.find(
            (orgItem) => orgItem.name === dropdownSelectHelper(org?.name || ''),
          )?.id : undefined)
          : user?.organisations[0].id,
    };

    const setMattersOrdersQuery = () => {
      const sQuery = changedQueries.searchQuery
        ? `s=${changedQueries.searchQuery}`
        : '';
      const startDayQuery = changedQueries.startDayQuery
        ? `startDate=${new Date(changedQueries.startDayQuery).getTime()}`
        : '';
      const endDateQuery = changedQueries.endDateQuery
        ? `endDate=${new Date(changedQueries.endDateQuery).getTime()}`
        : '';
      const userIdQuery = changedQueries.userIdQuery
        ? `userId=${changedQueries.userIdQuery}`
        : '';
      const userReportType = changedQueries.userReportType
        ? `billableOrders=${changedQueries.userReportType}`
        : '';
      const organisationId = changedQueries.organisationIdQuery
        ? `organisationId=${changedQueries.organisationIdQuery}`
        : '';

      const query = [
        sQuery,
        startDayQuery,
        endDateQuery,
        userIdQuery,
        userReportType,
        organisationId,
      ]
        .filter((el) => !!el)
        .join('&');

      return `?${query}`;
    };

    dispatch(getReportsAction(setMattersOrdersQuery()));
  };

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <div>
          <PageTitle marginBottom="16px">Reporting</PageTitle>
          <p>Manage Quick Reporting in this page</p>
        </div>
        <ExportCSV
          onClick={handleExportCSV}
          disabled={!reports || reports.length === 0}
        >
          <ExportIcon />
          Export CSV
        </ExportCSV>
      </PageHeader>
      {users ? (
        <Content>
          <div>
            <FiltersWrap>
              <Filters
                search={{
                  searchValue: search,
                  setSearchValue: setValue,
                  placeholder: 'Matter / Order ID (Optional)',
                  clear: handleClearInput,
                }}
                datepicker={{
                  title: 'Dates',
                  startDate,
                  endDate,
                  setDates,
                  billingFilters: [
                    {
                      ref: billingRef,
                      id: 'billing',
                      name: 'Period',
                      value: billingOption?.option || '',
                      setValue: selectBillingOption,
                      values: BILLING_OPTIONS,
                      keyForValue: 'option',
                      isApplied: !!billingOption && !!billingOption.option,
                      isDropdownVisible: isBillingVisible,
                      toggleIsVisible: toggleIsBillingVisible,
                      containLargeValues: true,
                      isBilling: true,
                    },
                  ],
                }}
                filters={[
                  {
                    ref: reportTypeRef,
                    name: 'Report Type',
                    value: selectedReportType?.name || '',
                    setValue: selectReportType,
                    values: reportType,
                    keyForValue: 'name',
                    isApplied: !!selectedReportType,
                    isDropdownVisible: isReportTypeVisible,
                    toggleIsVisible: toggleIsReportTypeVisible,
                    containLargeValues: true,
                  },
                  {
                    ref: usersRef,
                    name: 'Users',
                    value: selectedUser?.name || '',
                    setValue: selectOrgUser,
                    values: allUsers,
                    keyForValue: 'name',
                    isApplied: !!selectedUser,
                    isDropdownVisible: isUsersVisible,
                    toggleIsVisible: toggleIsUsersVisible,
                    containLargeValues: true,
                  },
                  {
                    name: 'Organisations',
                    value: org?.name || '',
                    setValue: selectOrg,
                    values: organisationsNames,
                    keyForValue: 'name',
                    isApplied: !!org,
                    ref: orgRef,
                    isUseSearch: true,
                    isSortValeus: true,
                    isDropdownVisible: isOrgsVisible,
                    toggleIsVisible: toggleIsOrgsVisible,
                    containLargeValues: true,
                  },
                ].slice(0, user?.role === Roles.SYSTEM_ADMIN ? 3 : 2)}
              />
              <StyledButton
                onClick={handleSearchClick}
              >
                Search
              </StyledButton>
            </FiltersWrap>
            {isReportsLoading ? (
              <LoaderWrap>
                <Loader />
              </LoaderWrap>
            ) : reports && reports?.length > 0 ? (
              <TableWrapper ref={tableRef} height={height}>
                <Table>
                  <THead>
                    <TRow>
                      <TTh>{tableHeaderLabels[0]}</TTh>
                      <TTh>{tableHeaderLabels[1]}</TTh>
                      <TTh width={11}>{tableHeaderLabels[2]}</TTh>
                      <TTh width={11}>{tableHeaderLabels[3]}</TTh>
                      <TTh>{tableHeaderLabels[4]}</TTh>
                      <TTh>{tableHeaderLabels[5]}</TTh>
                      <TTh width={14}>{tableHeaderLabels[6]}</TTh>
                      <TTh>{tableHeaderLabels[7]}</TTh>
                      <TTh>{tableHeaderLabels[8]}</TTh>
                      <TTh>{tableHeaderLabels[9]}</TTh>
                      <TTh>{tableHeaderLabels[10]}</TTh>
                    </TRow>
                  </THead>
                  <TBody>
                    {reports.map((report, i) => (
                      <TRow key={report.orderId + i}>
                        <TTd>
                          <Div>{report.dateCompleted ? convertTimestamp(+report.dateCompleted, true) : '-'}</Div>
                        </TTd>
                        <TTd>
                          <Div>{report.orderId}</Div>
                        </TTd>
                        <TTd width={11}>
                          <Div>{convertTimestamp(+report.orderDate, true)}</Div>
                        </TTd>
                        <TTd width={11}>
                          <Div>{report.organisation}</Div>
                        </TTd>
                        <TTd>
                          <Div>{report.user}</Div>
                        </TTd>
                        <TTd>
                          <Div>{report.matter}</Div>
                        </TTd>
                        <TTd width={14}>
                          <Div>{report.service}</Div>
                        </TTd>
                        <TTd>
                          <Div>{report.searchDetails}</Div>
                        </TTd>
                        <TTd>
                          <Div>{formatTotal(report.totalEx)}</Div>
                        </TTd>
                        <TTd>
                          <Div>{formatTotal(report.gst)}</Div>
                        </TTd>
                        <TTd>
                          <Div>{formatTotal(report.totalInc)}</Div>
                        </TTd>
                      </TRow>
                    ))}
                  </TBody>
                  <TFoot>
                    <TRow>
                      <TTd />
                      <TTd width={11} />
                      <TTd width={11} />
                      <TTd />
                      <TTd />
                      <TTd width={14} />
                      <TTd>
                        <Div>Totals:</Div>
                      </TTd>
                      <TTd>
                        <Div>{`$${(totalEx / 100)?.toFixed(2)}`}</Div>
                      </TTd>
                      <TTd>
                        <Div>{`$${(gstTotal / 100)?.toFixed(2)}`}</Div>
                      </TTd>
                      <TTd>
                        <Div>{`$${(totalInc / 100)?.toFixed(2)}`}</Div>
                      </TTd>
                    </TRow>
                  </TFoot>
                </Table>
              </TableWrapper>
            ) : reports?.length === 0 ? (
              <NoFound />
            ) : null}
          </div>
        </Content>
      ) : (
        <Loader />
      )}
    </PageContainer>
  );
};

const TableWrapper = styled.div<{ height?: number }>`
  overflow-x: auto;

  table {
    width: 100%;
    min-width: 1350px;
  }

  table,
  td {
    border-collapse: collapse;
  }

  thead,
  tfoot {
    display: table; /* to take the same width as tr */
    width: calc(100% - 10px); // - 10px because of the scrollbar width
  }

  tbody {
    display: block; /* to enable vertical scrolling */
    height: ${({ height }) => height}px;
    min-height: 400px;
    overflow-y: scroll; /* keeps the scrollbar even if it doesn't need it; display purpose */
    margin: 10px 0;
  }

  th,
  td {
    /* width: 33.33%;  */ /* to enable "word-break: break-all" */
    word-break: break-all;
    min-width: 120px;
  }

  thead,
  thead tr,
  thead th {
    background-color: rgb(249, 249, 249);
    cursor: default;
  }

  th {
    background-color: #f9f9f9;
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
  }

  tr {
    display: table;
    width: 100%;
    box-sizing: border-box;
  }

  tbody tr {
    cursor: pointer;

    &:hover {
      background: rgb(249, 249, 249);

      td {
        background: rgb(249, 249, 249);
      }
    }
  }

  td {
    min-height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    text-align: left;
  }

  tfoot {
    position: relative;
    z-index: 1;
    background: #ffffff;
    font-weight: 600;
  }

  tfoot,
  tfoot td,
  tfoot tr {
    background: #ffffff;
    cursor: default;
    &:hover {
      background: #ffffff;
    }
  }

  // scrollbar
  tbody::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  tbody::-webkit-scrollbar-track {
    background: #f8f8f8;
    border: 2px solid transparent;
  }

  /* Handle */
  tbody::-webkit-scrollbar-thumb {
    background: #acb5bb;
    border-radius: 4px;
    width: 10px;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
    border: 2px solid #f8f8f8;
    height: 30%;
  }

  tbody::-webkit-scrollbar-button {
    display: block;
    background-color: #f8f8f8;
    background-repeat: no-repeat;
    background-position: center;
  }

  tbody::-webkit-scrollbar-button:vertical:start:increment {
    background-image: url(${scrollUpIcon});
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  tbody::-webkit-scrollbar-button:vertical:start:decrement {
    display: none;
  }

  tbody::-webkit-scrollbar-button:vertical:end:increment {
    display: none;
  }

  tbody::-webkit-scrollbar-button:vertical:end:decrement {
    background-image: url(${scrollDownIcon});
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const Table = styled.table`
  width: inherit;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
`;
const THead = styled.thead`
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: -10px;
    width: 10px;
    height: 100%;
    background-color: #f9f9f9;
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
const TTh = styled.th<{ width?: number }>`
  text-align: start;
  width: ${({ width }) => width ?? 9}%;
  white-space: nowrap;
`;
const TBody = styled.tbody`
  th,
  td {
    min-height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    text-align: left;
  }
`;
const TTd = styled.td<{ width?: number }>`
  width: ${({ width }) => width ?? 9}%;
`;
const TFoot = styled.tfoot`
  position: relative;

  & div {
    font-weight: 600;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(26, 28, 30, 0.16);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: -10px;
    width: 10px;
    height: 100%;
    background-color: #ffffff;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 12px 0;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  margin-left: 8px;
`;

export const ExportCSV = styled(Button)`
  grid-gap: 8px;
  height: 50px;

  &:disabled {
    background: #acb5bb;
  }
`;

const FiltersWrap = styled.div`
  display: flex;
  width: 100%;

  & > div:first-child {
    flex-grow: 1;
    width: 100%;
  }

  #billing {
    order: -1 !important;
  }
`;

const LoaderWrap = styled.div`
  margin: 84px;
`;

export default ReportingPage;
