import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import base64 from 'base-64';

import LoadingContainer from '@/components/LoadingContainer';
import FiltersOrdersTable, { IInitialQuery } from '@/components/Orders/FiltersOrdersTable';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import { getOrdersAction } from '@/store/actions/userActions';
import {
  getSysAdminUsersAction,
  getUsersAction,
} from '@/store/actions/usersActions';

import { Roles } from '@/store/reducers/user';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import {
  selectOrders,
  selectOrdersTotal,
  selectUser,
} from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useToggle from '@/hooks/useToggle';

import { getObjectFromQueries, getQueries } from '@/utils/api';
import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';

import { AppDispatch } from '@/store';

interface Props {}

const OrdersTableContainer: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { search } = useLocation();

  const [isOrdersLoading, setIsOrdersLoading] = useToggle(true);
  const [isUsersLoading, setIsUsersLoading] = useToggle(true);
  const [isOrganisationsLoading, setIsOrganisationsLoading] = useToggle(true);

  const user = useSelector(selectUser)!;
  const users = useSelector(selectUsers);
  const organisations = useSelector(selectBaseOrganisationsInfo);
  const orders = useSelector(selectOrders);
  const ordersTotal = useSelector(selectOrdersTotal) || 0;

  const decodedQuery = useMemo(() => base64.decode(search.slice(1)), [search]);

  const isLoading = useMemo(
    () => isOrganisationsLoading || isUsersLoading,
    [isOrganisationsLoading, isUsersLoading],
  );

  const query = useMemo(
    () => ({
      ...getObjectFromQueries(decodedQuery),
      ...(user.userSettings?.general?.isShowOwnOrders ? { userId: user.id } : {}),
    }),
    [decodedQuery, user],
  );

  const allUsers = useMemo(
    () => users.map((item) => ({
      ...item,
      name: `${item.firstName} ${item.lastName} ${ID_FOR_DROPDOWN_SELECT}${item.id}`,
    })),
    [users],
  );

  const organisationNames = useMemo(() => {
    if (user?.role === Roles.SYSTEM_ADMIN) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name} ${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [user, organisations]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsUsersLoading(true);

    switch (user?.role) {
      case Roles.SYSTEM_ADMIN:
        await dispatch(getSysAdminUsersAction());
        break;
      default:
        await dispatch(getUsersAction(user.organisations[0].id));
        break;
    }

    setIsUsersLoading(false);
  };

  useEffect(() => {
    getOrganisations();
  }, []);

  const getOrganisations = async () => {
    setIsOrganisationsLoading(true);
    if (user?.role === Roles.SYSTEM_ADMIN) {
      await dispatch(getBaseOrganisationsInfoAction());
    }
    setIsOrganisationsLoading(false);
  };

  useEffect(() => {
    getInitOrders(query);
  }, [query]);

  const getInitOrders = async (q: IInitialQuery) => {
    setIsOrdersLoading(true);

    await dispatch(getOrdersAction(getQueries(q)));

    setIsOrdersLoading(false);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <FiltersOrdersTable
        orders={orders}
        users={allUsers}
        organisations={organisationNames}
        ordersTotal={ordersTotal}
        initialQuery={query}
        isOrdersLoading={isOrdersLoading}
      />
    </LoadingContainer>
  );
};

export default OrdersTableContainer;
