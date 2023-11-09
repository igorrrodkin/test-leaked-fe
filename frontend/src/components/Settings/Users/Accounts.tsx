import React, { RefObject } from 'react';

import NoFound from '@/components/NoFound';
import Pagination from '@/components/Pagination';
import AccountsTable from '@/components/Settings/Users/AccountsTable';
import UsersBlock from '@/components/Settings/Users/UsersBlock';
import Filters from '@/components/Table/Filters';

import { Roles } from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { HandleToggle } from '@/hooks/useToggle';

import roleToText from '@/utils/roleToText';

interface IGeneralInfo {
  isRolesVisible: boolean;
  title?: string;
  subtitle?: string;
  search: string;
  role: Roles | null;
  userRole: Roles;
  limits: number[];
  limit: number;
  usersToShow: IOrganisationUser[];
  calculatedOffset: number;
  maxPages: number;
  maxElements: number;
  rolesRef: RefObject<HTMLDivElement>;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRole: Function;
  handleClearInput: () => void;
  toggleIsRolesVisible: HandleToggle;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  handleEditUser: (key: IOrganisationUser) => void;
  handleDeleteUser: (key: IOrganisationUser) => void;
}

const Accounts: React.FC<IGeneralInfo> = ({
  isRolesVisible,
  title = 'Accounts visible to me',
  subtitle = 'You can only manage users in your branch and below',
  search,
  role,
  userRole,
  rolesRef,
  calculatedOffset,
  maxPages,
  maxElements,
  limits,
  limit,
  usersToShow,
  setValue,
  setRole,
  handleClearInput,
  toggleIsRolesVisible,
  setOffset,
  setLimit,
  handleEditUser,
  handleDeleteUser,
}) => (
  <UsersBlock title={title} subtitle={subtitle}>
    <div>
      <Filters
        search={{
          searchValue: search,
          setSearchValue: setValue,
          placeholder: 'Search users',
          clear: handleClearInput,
        }}
        filters={[
          {
            name: 'Type',
            value: role,
            setValue: setRole,
            values: Object.values(Roles)
              .filter((el) => !(userRole !== Roles.SYSTEM_ADMIN && el === Roles.SYSTEM_ADMIN)),
            isApplied: !!role,
            ref: rolesRef,
            isDropdownVisible: isRolesVisible,
            toggleIsVisible: toggleIsRolesVisible,
            normalizeValue: (v: string) => roleToText(v as Roles).toLowerCase(),
            containLargeValues: true,
          },
        ]}
      />
      {usersToShow.length > 0 ? (
        <AccountsTable
          usersToShow={usersToShow}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
        />
      ) : (
        <NoFound />
      )}
    </div>
    {usersToShow.length > 0 && (
    <Pagination
      changePage={setOffset}
      currentPage={calculatedOffset}
      maxPages={maxPages}
      maxElements={maxElements}
      limits={limits}
      limit={limit}
      setLimit={setLimit}
    />
    )}
  </UsersBlock>
);

export default Accounts;
