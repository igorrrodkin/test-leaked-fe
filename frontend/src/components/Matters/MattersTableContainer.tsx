import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import base64 from 'base-64';

import LoadingContainer from '@/components/LoadingContainer';
import FiltersMattersTable from '@/components/Matters/FiltersMattersTable';
import { IInitialQuery } from '@/components/Orders/FiltersOrdersTable';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import { getMattersAction } from '@/store/actions/userActions';
import {
  getSysAdminUsersAction,
  getUsersAction,
} from '@/store/actions/usersActions';

import { Roles } from '@/store/reducers/user';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import {
  selectMatters,
  selectMattersTotal,
  selectUser,
} from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useToggle from '@/hooks/useToggle';

import { getObjectFromQueries, getQueries } from '@/utils/api';
import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';

import { AppDispatch } from '@/store';

interface Props {}

const MattersTableContainer: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { search } = useLocation();

  const [isMattersLoading, setIsMattersLoading] = useToggle(true);
  const [isUsersLoading, setIsUsersLoading] = useToggle(true);
  const [isOrganisationsLoading, setIsOrganisationsLoading] = useToggle(true);

  const user = useSelector(selectUser)!;
  const users = useSelector(selectUsers);
  const organisations = useSelector(selectBaseOrganisationsInfo);
  const matters = useSelector(selectMatters);
  const mattersTotal = useSelector(selectMattersTotal) || 0;

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
    getInitMatters(query);
  }, [query]);

  const getInitMatters = async (q: IInitialQuery) => {
    setIsMattersLoading(true);

    await dispatch(getMattersAction(getQueries(q)));

    setIsMattersLoading(false);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <FiltersMattersTable
        matters={matters}
        users={allUsers}
        organisations={organisationNames}
        mattersTotal={mattersTotal}
        initialQuery={query}
        isMattersLoading={isMattersLoading}
      />
    </LoadingContainer>
  );
};

export default MattersTableContainer;
