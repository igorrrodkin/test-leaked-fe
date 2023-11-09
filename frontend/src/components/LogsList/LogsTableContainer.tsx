import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import base64 from 'base-64';

import LoadingContainer from '@/components/LoadingContainer';
import LogsListPage from '@/components/LogsList/LogsListPage';

import { getLogsAction } from '@/store/actions/logsActions';
import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import {
  getSysAdminUsersAction,
  getUsersAction,
} from '@/store/actions/usersActions';

import { Roles } from '@/store/reducers/user';

import { selectLogs } from '@/store/selectors/logsSelector';
import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import {
  selectUser,
} from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useToggle from '@/hooks/useToggle';

import { getObjectFromQueriesForLogs, getQueries } from '@/utils/api';
import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';
import { ILogsInitialQuery } from '@/utils/setLogsQuery';

import { AppDispatch } from '@/store';

const LogsTableContainer: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { search } = useLocation();

  const [isLogsLoading, setIsLogsLoading] = useToggle(true);
  const [isUsersLoading, setIsUsersLoading] = useToggle(true);
  const [isOrganisationsLoading, setIsOrganisationsLoading] = useToggle(true);

  const user = useSelector(selectUser)!;
  const users = useSelector(selectUsers);
  const organisations = useSelector(selectBaseOrganisationsInfo);
  const logs = useSelector(selectLogs);

  const decodedQuery = useMemo(() => base64.decode(search.slice(1)), [search]);

  const isLoading = useMemo(
    () => isOrganisationsLoading || isUsersLoading,
    [isOrganisationsLoading, isUsersLoading],
  );

  const query = useMemo(
    () => ({
      ...getObjectFromQueriesForLogs(decodedQuery),
    }),
    [decodedQuery],
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

    const getOrganisations = async () => {
      setIsOrganisationsLoading(true);
      if (user?.role === Roles.SYSTEM_ADMIN) {
        await dispatch(getBaseOrganisationsInfoAction());
      }
      setIsOrganisationsLoading(false);
    };

    getUsers();
    getOrganisations();
  }, []);

  useEffect(() => {
    const getInitMatters = async (newQuery: ILogsInitialQuery) => {
      setIsLogsLoading(true);

      await dispatch(getLogsAction(getQueries(newQuery)));

      setIsLogsLoading(false);
    };

    window.scrollTo(0, 0);

    getInitMatters(query);
  }, [query]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <LogsListPage
        logs={logs.result}
        users={allUsers}
        organisations={organisationNames}
        logsTotal={logs.totalCount || 0}
        initialQuery={query}
        isLogsLoading={isLogsLoading}
      />
    </LoadingContainer>
  );
};

export default LogsTableContainer;
