import { EOrderItemType } from '@/store/reducers/order';
import { OrderStatusEnum } from '@/store/reducers/user';

export interface IChangedQueries {
  offsetQuery: number;
  limitQuery: number;
  searchQuery: string | undefined;
  startDayQuery: Date | undefined;
  endDateQuery: Date | undefined;
  statusQuery: OrderStatusEnum | null;
  userIdQuery: number | undefined;
  matterQuery?: string | undefined;
  organisationIdQuery: number | undefined;
}

export const defaultQueryParams = (defaultOptions?: { defaultUserId?: number }) => ({
  offsetQuery: 0,
  limitQuery: 0,
  searchQuery: undefined,
  startDayQuery: undefined,
  endDateQuery: undefined,
  statusQuery: null,
  userIdQuery: defaultOptions?.defaultUserId || undefined,
  matterQuery: undefined,
  organisationIdQuery: undefined,
});

const setMattersOrdersQuery = (changedQueries: IChangedQueries) => {
  const pageNumberQuery = changedQueries.offsetQuery === undefined ? '' : `pageNumber=${changedQueries.offsetQuery + 1}`;
  const pageSizeQuery = changedQueries.limitQuery === undefined ? '' : `&pageSize=${changedQueries.limitQuery}`;
  const sQuery = changedQueries.searchQuery
    ? `&s=${changedQueries.searchQuery}`
    : '';
  const startDayQuery = changedQueries.startDayQuery
    ? `&startDate=${new Date(changedQueries.startDayQuery).getTime()}`
    : '';
  const endDateQuery = changedQueries.endDateQuery
    ? `&endDate=${new Date(changedQueries.endDateQuery).getTime()}`
    : '';
  let statusQuery = '';
  const userIdQuery = changedQueries.userIdQuery
    ? `&userId=${changedQueries.userIdQuery}`
    : '';
  const matterQuery = changedQueries.matterQuery
    ? `&matter=${changedQueries.matterQuery}`
    : '';
  const organisationId = changedQueries.organisationIdQuery
    ? `&organisationId=${changedQueries.organisationIdQuery}`
    : '';

  if (changedQueries.statusQuery === OrderStatusEnum.COMPLETE || changedQueries.statusQuery === OrderStatusEnum.LIST) {
    statusQuery += `&status=${OrderStatusEnum.COMPLETE}`;
    statusQuery += `&type=${changedQueries.statusQuery === OrderStatusEnum.COMPLETE
      ? EOrderItemType.PURCHASE
      : EOrderItemType.SEARCH}`;
  } else {
    statusQuery += changedQueries.statusQuery
      ? `&status=${changedQueries.statusQuery
        .toLowerCase()
        .replaceAll('_', ' ')}`
      : '';
  }

  return pageNumberQuery
    + pageSizeQuery
    + sQuery
    + startDayQuery
    + endDateQuery
    + statusQuery
    + userIdQuery
    + matterQuery
    + organisationId;
};

export default setMattersOrdersQuery;
