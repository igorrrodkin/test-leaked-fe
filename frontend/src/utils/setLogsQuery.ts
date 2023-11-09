export interface ILogsInitialQuery {
  pageNumber?: number;
  pageSize?: number;
  organisationId?: string;
  userId?: number;
  startDate?: number;
  endDate?: number;
  status?: string;
  vendorStatus?: string;
  searchInput?: string;
}

export interface IChangedLogsQueries {
  offsetQuery: number;
  limitQuery: number;
  searchInputQuery?: string;
  startDayQuery?: Date;
  endDateQuery?: Date;
  statusQuery: string | null;
  vendorStatusQuery: string | null;
  userIdQuery?: number;
  organisationIdQuery?: number;
}

export const setLogsQuery = (changedQueries: IChangedLogsQueries) => {
  const pageNumberQuery = changedQueries.offsetQuery === undefined ? '' : `pageNumber=${changedQueries.offsetQuery + 1}`;
  const pageSizeQuery = changedQueries.limitQuery === undefined ? '' : `&pageSize=${changedQueries.limitQuery}`;
  const sQuery = changedQueries.searchInputQuery
    ? `&searchInput=${changedQueries.searchInputQuery}`
    : '';
  const startDayQuery = changedQueries.startDayQuery
    ? `&startDate=${new Date(changedQueries.startDayQuery).getTime()}`
    : '';
  const endDateQuery = changedQueries.endDateQuery
    ? `&endDate=${new Date(changedQueries.endDateQuery).getTime()}`
    : '';
  const userIdQuery = changedQueries.userIdQuery
    ? `&userId=${changedQueries.userIdQuery}`
    : '';
  const statusQuery = changedQueries.statusQuery
    ? `&status=${changedQueries.statusQuery}`
    : '';
  const vendorStatusQuery = changedQueries.vendorStatusQuery
    ? `&vendorStatus=${changedQueries.vendorStatusQuery}`
    : '';
  const organisationId = changedQueries.organisationIdQuery
    ? `&organisationId=${changedQueries.organisationIdQuery}`
    : '';

  return pageNumberQuery
    + pageSizeQuery
    + sQuery
    + startDayQuery
    + endDateQuery
    + statusQuery
    + vendorStatusQuery
    + userIdQuery
    + organisationId;
};
