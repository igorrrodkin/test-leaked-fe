import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';
import styled from 'styled-components';

import LoadingContainer from '@/components/LoadingContainer';
import NoFound from '@/components/NoFound';
import OrdersTable from '@/components/Orders/OrdersTable';
import SelectedOrdersPopUp from '@/components/Orders/SelectedOrdersPopUp';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { EOrderItemType } from '@/store/reducers/order';
import { IBaseOrganisationsInfo, IOrganisation } from '@/store/reducers/organisations';
import { Order, OrderStatusEnum } from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectUser } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';
import setMattersOrdersQuery from '@/utils/setMattersOrdersQuery';

const limits = [20, 50, 100];

export const statuses = (
  Object.values(OrderStatusEnum) as Array<OrderStatusEnum>
).map((key) => key);

export interface IInitialQuery {
  pageNumber?: number;
  pageSize?: number;
  s?: string;
  startDate?: number;
  endDate?: number;
  userId?: number;
  matter?: string;
  organisationId?: string;
  status?: OrderStatusEnum;
  type?: EOrderItemType;
}

interface Props {
  orders: Order[];
  users: IOrganisationUser[];
  organisations: IBaseOrganisationsInfo[];
  ordersTotal: number;
  initialQuery: IInitialQuery;
  isOrdersLoading: boolean;
}

const FiltersOrdersTable: React.FC<Props> = ({
  orders,
  users,
  ordersTotal,
  organisations,
  initialQuery,
  isOrdersLoading,
}) => {
  const navigate = useNavigate();

  const user = useSelector(selectUser)!;

  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [search, setSearch] = useInput(initialQuery.s || '');
  const [startDay, setStartDay] = useState<Date | undefined>(
    initialQuery.startDate ? new Date(+initialQuery.startDate) : undefined,
  );
  const [endDay, setEndDay] = useState<Date | undefined>(
    initialQuery.endDate ? new Date(+initialQuery.endDate) : undefined,
  );
  const [status, setStatus] = useState<OrderStatusEnum | null>(() => {
    if (initialQuery.type === EOrderItemType.SEARCH) {
      return OrderStatusEnum.LIST;
    }
    return initialQuery.status || null;
  });
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

  const [offset, setOffset] = useState(
    initialQuery.pageNumber ? initialQuery.pageNumber - 1 : 0,
  );
  const [limit, setLimit] = useState(() => {
    if (!initialQuery.pageSize) {
      return 0;
    }

    const index = limits.findIndex((l) => +initialQuery.pageSize! === l);
    return index !== -1 ? index : 0;
  });

  const [debounce, setDebounce] = useState<NodeJS.Timeout>();

  useEffect(() => {
    setSearch(initialQuery.s || '');
    setStartDay(
      initialQuery.startDate ? new Date(+initialQuery.startDate) : undefined,
    );
    setEndDay(
      initialQuery.endDate ? new Date(+initialQuery.endDate) : undefined,
    );
    setStatus(() => {
      if (initialQuery.type === EOrderItemType.SEARCH) {
        return OrderStatusEnum.LIST;
      }
      return initialQuery.status || null;
    });
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
    setOffset(initialQuery.pageNumber ? initialQuery.pageNumber - 1 : 0);
    setLimit(() => {
      if (!initialQuery.pageSize) {
        return 0;
      }

      const index = limits.findIndex((l) => +initialQuery.pageSize! === l);

      return index !== -1 ? index : 0;
    });
  }, [initialQuery]);

  const [statusRef, isStatusVisible, toggleIsStatusVisible] = useOnClickOutside<HTMLDivElement>();
  const [usersRef, isUsersVisible, toggleIsUsersVisible] = useOnClickOutside<HTMLDivElement>();
  const [
    organisationRef,
    isOrganisationsVisible,
    toggleIsOrganisationsVisible,
  ] = useOnClickOutside<HTMLDivElement>();

  const maxPages = useMemo(
    () => Math.ceil(ordersTotal / limits[limit]),
    [limit, ordersTotal],
  );

  const calculatedOffset = useMemo(
    () => (maxPages > 1 ? offset : 0),
    [maxPages, offset],
  );

  const allUsers = useMemo(
    () => users.map((item) => ({
      ...item,
      name: `${item.firstName} ${item.lastName} ${ID_FOR_DROPDOWN_SELECT}${item.id}`,
    })),
    [users],
  );

  const handleSearch = (s: string) => {
    if (debounce) {
      clearTimeout(debounce);
    }

    setSearch(s);
    setOffset(0);

    const debounceValue = setTimeout(() => {
      const newQuery = setMattersOrdersQuery({
        offsetQuery: 0,
        limitQuery: limits[limit],
        searchQuery: s,
        startDayQuery: startDay,
        endDateQuery: endDay,
        statusQuery: status,
        userIdQuery: selectedUser?.id,
        matterQuery: initialQuery.matter,
        organisationIdQuery: selectedOrganisation?.id,
      });

      navigate({ search: base64.encode(newQuery) });
    }, 500);

    setDebounce(debounceValue);
  };

  const handlePageChange = (item: number) => {
    setOffset(item);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: item,
      limitQuery: limits[limit],
      searchQuery: search,
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      userIdQuery: selectedUser?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handleSelectOrganisation = (orgItem: IOrganisation) => {
    setSelectedOrganisation(orgItem);
    setOffset(0);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchQuery: search,
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      userIdQuery: selectedUser?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: orgItem?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const selectStatus = (s: OrderStatusEnum) => {
    setStatus(s);
    setOffset(0);
    toggleIsStatusVisible(false);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchQuery: search,
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: s,
      userIdQuery: selectedUser?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const submitDates = (start?: Date, end?: Date) => {
    setStartDay(start);
    setEndDay(end);
    setOffset(0);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchQuery: search,
      startDayQuery: start,
      endDateQuery: end,
      statusQuery: status,
      userIdQuery: selectedUser?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const selectOrgUser = (userObj: IOrganisationUser) => {
    setSelectedUser(userObj);
    toggleIsUsersVisible(false);
    setOffset(0);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: 0,
      limitQuery: limits[limit],
      searchQuery: search,
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      userIdQuery: userObj?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  const handlePageSize = (item: number) => {
    setLimit(item);
    setOffset(0);

    const newQuery = setMattersOrdersQuery({
      offsetQuery: 0,
      limitQuery: limits[item],
      searchQuery: search,
      startDayQuery: startDay,
      endDateQuery: endDay,
      statusQuery: status,
      userIdQuery: selectedUser?.id,
      matterQuery: initialQuery.matter,
      organisationIdQuery: selectedOrganisation?.id,
    });

    navigate({ search: base64.encode(newQuery) });
  };

  return (
    <FiltersOrdersTableStyled>
      <Filters
        isMarginBottom={false}
        search={{
          searchValue: search,
          placeholder: 'Matter / Order ID',
          setSearchValue: (evt) => {
            handleSearch(evt.target.value);
          },
          clear: () => handleSearch(''),
        }}
        datepicker={{
          startDate: startDay,
          endDate: endDay,
          setDates: submitDates,
        }}
        filters={[
          {
            ref: statusRef,
            name: 'Status',
            value: status,
            setValue: selectStatus,
            values: statuses,
            isApplied: !!status,
            isDropdownVisible: isStatusVisible,
            toggleIsVisible: toggleIsStatusVisible,
            normalizeValue: (v: string) => v.replaceAll('_', ' ').toLowerCase(),
            containLargeValues: true,
          },
          ...(user?.userSettings.general.isShowOwnOrders
            ? []
            : [
              {
                ref: usersRef,
                name: 'User',
                value: selectedUser?.name || '',
                setValue: selectOrgUser,
                values: allUsers,
                keyForValue: 'name',
                isApplied: !!selectedUser,
                isDropdownVisible: isUsersVisible,
                toggleIsVisible: toggleIsUsersVisible,
                containLargeValues: true,
              },
            ]),
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
        ]}
      />
      <LoadingContainer isLoading={isOrdersLoading}>
        {orders.length ? (
          <OrdersTable
            orders={orders}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            isMatter={!!initialQuery.matter}
          />
        ) : (
          <NoFound />
        )}
      </LoadingContainer>
      {!!orders.length && (
        <Pagination
          changePage={
            handlePageChange as React.Dispatch<React.SetStateAction<number>>
          }
          currentPage={calculatedOffset}
          maxPages={maxPages}
          maxElements={ordersTotal || 0}
          limits={limits}
          limit={limit}
          setLimit={
            handlePageSize as React.Dispatch<React.SetStateAction<number>>
          }
        />
      )}
      {!!selectedOrders.length && (
        <SelectedOrdersPopUp
          selectedOrders={selectedOrders}
          close={() => setSelectedOrders([])}
        />
      )}
    </FiltersOrdersTableStyled>
  );
};

const FiltersOrdersTableStyled = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 32px;
`;

export default FiltersOrdersTable;
