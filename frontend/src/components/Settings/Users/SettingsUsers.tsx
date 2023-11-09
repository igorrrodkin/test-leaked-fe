import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import Accounts from '@/components/Settings/Users/Accounts';
import CreateUserModal from '@/components/Settings/Users/CreateUserModal';
import GeneralUsersInfo from '@/components/Settings/Users/GeneralUsersInfo';

import {
  deleteUserByOrganisation,
  getUsersAction,
} from '@/store/actions/usersActions';

import { Roles } from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectUser } from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import { sort } from '@/utils/sort';

import { AppDispatch } from '@/store';

const limits = [20, 50, 100];

interface Props {
  organisationId?: number;
}

const SettingsUsers: React.FC<Props> = ({ organisationId }) => {
  const [limit, setLimit] = useState(0);
  const [search, setSearch] = useInput();
  const [role, setRole] = useState<Roles | null>(null); // for type
  const [rolesRef, isRolesVisible, toggleIsRolesVisible] = useOnClickOutside<HTMLDivElement>();
  const [isLoading, setIsLoading] = useToggle(true);
  const [isNewUserVisible, toggleIsNewUserVisible] = useToggle();
  const [isDeleteUserVisible, toggleIsDeleteUserVisible] = useToggle();
  const [editableUser, setEditableUser] = useState<
  IOrganisationUser | undefined
  >();
  const [isDeleteUserLoading, setIsDeleteUserLoading] = useToggle();
  const [offset, setOffset] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const user = useSelector(selectUser);

  const generalTitle = `${users.length} active total accounts`;
  const adminUsersAmount = users?.filter((userItem) => userItem.role !== Roles.CUSTOMER)?.length || 0;
  const commonUsersAmount = users.length - adminUsersAmount;
  const generalSubTitle = `${adminUsersAmount} admin${
    adminUsersAmount > 1 ? 's' : ''
  }${
    commonUsersAmount
      ? ` & ${commonUsersAmount} user${commonUsersAmount > 1 ? 's' : ''}`
      : ''
  }`;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [search, limit, role]);

  const filteredUsers = useMemo(() => {
    const usersFilteredByRole = role
      ? users.filter((u) => u.role === role)
      : users;

    const usersSearch = search
      ? usersFilteredByRole.filter(
        (u) => u.firstName.toLowerCase().includes(search.toLowerCase())
            || u.lastName.toLowerCase().includes(search.toLowerCase())
            || u.email.toLowerCase().includes(search.toLowerCase()),
      )
      : usersFilteredByRole;

    return sort(usersSearch, (u) => !u.firstName);
  }, [users, search, role]);

  const deleteUserText = useMemo(() => {
    if (!editableUser) {
      return '';
    }

    return `Are you sure you want to delete "${editableUser.firstName} ${editableUser.lastName}" ?`;
  }, [editableUser]);

  const usersPagination = useMemo(() => filteredUsers.slice(
    limits[limit] * offset,
    limits[limit] * offset + limits[limit],
  ), [filteredUsers, limit, offset]);

  const maxPages = Math.ceil(filteredUsers.length / limits[limit]);

  const calculatedOffset = maxPages > 1 ? offset : 0;

  const getData = async () => {
    setIsLoading(true);

    await dispatch(getUsersAction(organisationId || user!.organisations[0].id));

    setIsLoading(false);
  };

  const handleSetSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
    setOffset(0);
  };

  const handleBtnClick = () => {
    toggleIsNewUserVisible(true);
  };

  const handleEditUser = (userItem: IOrganisationUser) => {
    if (userItem.role === Roles.SYSTEM_ADMIN) return; // unable to edit sys admin

    setEditableUser(userItem);
    toggleIsNewUserVisible(true);
  };

  const handleOpenDeleteUserModal = (userItem: IOrganisationUser) => {
    if (userItem.role === Roles.SYSTEM_ADMIN) return; // unable to edit sys admin

    setEditableUser(userItem);
    toggleIsDeleteUserVisible(true);
  };

  const handleDeleteUser = async () => {
    if (!editableUser) return;

    setIsDeleteUserLoading(true);

    await dispatch(deleteUserByOrganisation(editableUser, handleCloseModal));

    setIsDeleteUserLoading(false);
  };

  const handleClearInput = () => {
    setSearch('');
  };

  const handleCloseModal = () => {
    toggleIsNewUserVisible(false);
    toggleIsDeleteUserVisible(false);
    setEditableUser(undefined);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <Wrap>
        <GeneralUsersInfo
          title={generalTitle}
          subtitle={generalSubTitle}
          handleBtnClick={handleBtnClick}
        />
        <Accounts
          isRolesVisible={isRolesVisible}
          search={search}
          role={role}
          userRole={user!.role}
          rolesRef={rolesRef}
          calculatedOffset={calculatedOffset}
          maxPages={maxPages}
          maxElements={users.length}
          limits={limits}
          limit={limit}
          usersToShow={usersPagination}
          setValue={(e) => handleSetSearch(e)}
          setRole={setRole}
          handleClearInput={handleClearInput}
          toggleIsRolesVisible={toggleIsRolesVisible}
          setOffset={setOffset}
          setLimit={setLimit}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleOpenDeleteUserModal}
        />
      </Wrap>
      {isNewUserVisible && (
        <CreateUserModal
          onClose={handleCloseModal}
          user={editableUser}
          organisationId={organisationId || user!.organisations[0].id}
        />
      )}
      {isDeleteUserVisible && (
        <Modal closeModal={handleCloseModal}>
          <DeactivateModal
            title="Delete user?"
            subTitle={deleteUserText}
            cancelButton={{
              onCancel: handleCloseModal,
              name: 'Cancel',
              isLoading: false,
              style: {
                isCancel: true,
                style: { height: '48px', fontSize: '16px' },
              },
            }}
            confirmButton={{
              onConfirm: handleDeleteUser,
              name: 'Delete User',
              isLoading: isDeleteUserLoading,
              style: {
                isRedButton: true,
                style: {
                  padding: '5px 30px',
                  height: '48px',
                  fontSize: '16px',
                },
              },
            }}
          />
        </Modal>
      )}
    </LoadingContainer>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  row-gap: 32px;
  min-height: 729px;
  height: 100%;
  /* min-width: 680px; */
`;

export default SettingsUsers;
