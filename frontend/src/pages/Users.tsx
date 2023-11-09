import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from '@/assets/icons/CloseIcon';
import UsersIcon from '@/assets/icons/UsersIcon';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import LoadingContainer from '@/components/LoadingContainer';
import DeactivateModal from '@/components/Modal/DeactivateModal';
import Modal from '@/components/Modal/Modal';
import NoFound from '@/components/NoFound';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';
import TableThCell from '@/components/Table/TableTHCell';

import { getBaseOrganisationsInfoAction } from '@/store/actions/organisationsActions';
import { userActions } from '@/store/actions/userActions';
import {
  changeUserStatusInOrganisation,
  getSysAdminUsersAction,
} from '@/store/actions/usersActions';

import { IOrganisation } from '@/store/reducers/organisations';
import { PopupTypes, Roles } from '@/store/reducers/user';
import { IOrganisationUser, UserStatus } from '@/store/reducers/users';

import { selectBaseOrganisationsInfo } from '@/store/selectors/organisationsSelector';
import { selectUser } from '@/store/selectors/userSelectors';
import { selectUsers } from '@/store/selectors/usersSelector';

import useInput from '@/hooks/useInput';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

import { ID_FOR_DROPDOWN_SELECT } from '@/utils/dropdownSelectHelper';
import getNounByForm from '@/utils/getNounByForm';
import roleToText from '@/utils/roleToText';
import { sort } from '@/utils/sort';

const limits = [20, 50, 100];

const Users = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [role, setRole] = useState<Roles | null>(null);
  const [search, setSearch] = useInput();
  const [statusRef, isStatusesVisible, toggleIsStatusesVisible] = useOnClickOutside<HTMLDivElement>();
  const [rolesRef, isRolesVisible, toggleIsRolesVisible] = useOnClickOutside<HTMLDivElement>();
  const [orgItem, setOrgItem] = useState<IOrganisation | null>(null);
  const [orgRef, isOrgsVisible, toggleIsOrgsVisible] = useOnClickOutside<HTMLDivElement>();
  const [selectedUsers, setSelectedUsers] = useState<IOrganisationUser[]>([]);
  const [isLoading, setIsLoading] = useToggle(true);
  const [isStatusLoading, setIsStatusLoading] = useToggle(false);
  const [isModal, setIsModal] = useToggle(false);

  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectUser);
  const organisations = useSelector(selectBaseOrganisationsInfo);

  const dispatch = useDispatch<any>();

  const organisationsNames = useMemo(() => {
    if (organisations) {
      return organisations.map((org) => ({
        ...org,
        name: `${org.name}${ID_FOR_DROPDOWN_SELECT}${org.id}`,
      }));
    }
    return [];
  }, [organisations]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);

    await Promise.all([
      dispatch(getSysAdminUsersAction()),
      dispatch(getBaseOrganisationsInfoAction()),
    ]);

    setIsLoading(false);
  };

  useEffect(() => {
    setOffset(0);
  }, [status, orgItem?.id, search, limit, role]);

  const filteredUsers = useMemo(() => {
    const organisationId = organisations?.find(
      ({ id }) => id === orgItem?.id,
    )?.id;

    const usersFilteredByStatus = status
      ? users.filter((user) => user.isUserActive === (status === UserStatus.ACTIVE))
      : users;

    const usersFilteredByOrganisation = organisationId
      ? usersFilteredByStatus.filter(
        (user) => user.organisationIds[0]?.organisationId === organisationId,
      )
      : usersFilteredByStatus;

    const usersFilteredByRole = role
      ? usersFilteredByOrganisation.filter((user) => user.role === role)
      : usersFilteredByOrganisation;

    const usersSearch = search
      ? usersFilteredByRole.filter(
        (user) => user.firstName.toLowerCase().includes(search.toLowerCase())
            || user.lastName.toLowerCase().includes(search.toLowerCase())
            || user.username.toLowerCase().includes(search.toLowerCase())
            || user.email.toLowerCase().includes(search.toLowerCase()),
      )
      : usersFilteredByRole;

    return sort(usersSearch, (user) => !user.isUserActive);
  }, [users, status, orgItem?.id, search, role]);

  const usersPagination = useMemo(() => filteredUsers.slice(
    limits[limit] * offset,
    limits[limit] * offset + limits[limit],
  ), [filteredUsers, limit, offset]);

  const maxPages = Math.ceil(filteredUsers.length / limits[limit]);

  const calculatedOffset = maxPages > 1 ? offset : 0;

  const onCheckboxClick = (
    isChecked: boolean,
    selectedUser: IOrganisationUser,
  ) => {
    setSelectedUsers((prevState) => {
      if (!isChecked) { return prevState.filter(({ id }) => !(id === selectedUser.id)); }
      return [...prevState, selectedUser];
    });
  };

  const handleChangeStatus = async () => {
    setIsStatusLoading(true);

    const requests = {
      status: !selectedUsers[0].isUserActive,
      usersIds: selectedUsers.map((user) => user.id),
    };

    await dispatch(changeUserStatusInOrganisation(requests));
    await dispatch(getSysAdminUsersAction());

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success',
      additionalText: 'Status have been changed',
    }));

    setSelectedUsers([]);
    setIsStatusLoading(false);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleActivateUser = () => {
    if (!selectedUsers[0].isUserActive) {
      handleChangeStatus();
      return;
    }

    handleOpenModal();
  };

  const deactivateUserText = useMemo(() => {
    if (!selectedUsers.length) {
      return '';
    }

    if (selectedUsers.length > 1) {
      return `Are you sure you want to deactivate the selected ${selectedUsers.length} users ?`;
    }

    return `Are you sure you want to deactivate ${selectedUsers[0].firstName} ${selectedUsers[0].lastName} ?`;
  }, [selectedUsers]);

  const clearAllSelectedUsers = () => {
    setSelectedUsers([]);
  };

  const allPossibleUsersChoose = useMemo(
    () => usersPagination.filter((user) => {
      if (selectedUsers[0]?.isUserActive !== undefined) {
        return (
          user.isUserActive === selectedUsers[0]?.isUserActive
            && currentUser!.id !== user.id
        );
      }
      if (usersPagination.find(({ isUserActive }) => !isUserActive)) {
        return !user.isUserActive && currentUser!.id !== user.id;
      }
      return user.isUserActive && currentUser!.id !== user.id;
    }),
    [usersPagination, selectedUsers],
  );

  const isAllChecked = useMemo(
    () => allPossibleUsersChoose.every((org) => selectedUsers.some((user) => org.id === user.id)),
    [allPossibleUsersChoose, selectedUsers],
  );

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedUsers = selectedUsers.filter(
        ({ id }) => !allPossibleUsersChoose.some((org) => id === org.id),
      );
      setSelectedUsers(removedSelectedUsers);
      return;
    }

    const allSelectedUsers = allPossibleUsersChoose.reduce((acc, org) => {
      if (acc.some(({ id }) => org.id === id)) {
        return acc;
      }

      return [...acc, org];
    }, selectedUsers);

    setSelectedUsers(allSelectedUsers);
  };

  const isActiveMod = useMemo(() => selectedUsers[0]?.isUserActive, [selectedUsers]);

  return (
    <PageContainer contentPadding="32px 0">
      <LoadingContainer isLoading={isLoading}>
        <PageHeader>
          <PageTitle marginBottom="16px">Users</PageTitle>
          <p>Manage users in this page</p>
        </PageHeader>
        <Content>
          <div>
            <Filters
              search={{
                searchValue: search,
                placeholder: 'Serch users',
                setSearchValue: (evt) => {
                  setSearch(evt.target.value);
                  setOffset(0);
                },
                clear: () => setSearch(''),
              }}
              filters={[
                {
                  name: 'Type',
                  value: role,
                  setValue: setRole,
                  values: Object.values(Roles),
                  isApplied: !!role,
                  ref: rolesRef,
                  isDropdownVisible: isRolesVisible,
                  toggleIsVisible: toggleIsRolesVisible,
                  normalizeValue: (v) => roleToText(v as Roles).toLowerCase(),
                  containLargeValues: true,
                },
                {
                  name: 'Status',
                  value: status,
                  setValue: setStatus,
                  values: Object.values(UserStatus),
                  isApplied: status !== null,
                  ref: statusRef,
                  isDropdownVisible: isStatusesVisible,
                  normalizeValue: (v: string) => v.toLowerCase(),
                  toggleIsVisible: toggleIsStatusesVisible,
                },
                {
                  name: 'Organisation',
                  value: orgItem?.name || '',
                  setValue: setOrgItem,
                  values: organisationsNames,
                  keyForValue: 'name',
                  isApplied: !!orgItem,
                  ref: orgRef,
                  isDropdownVisible: isOrgsVisible,
                  toggleIsVisible: toggleIsOrgsVisible,
                  containLargeValues: true,
                  isUseSearch: true,
                  isSortValeus: true,
                },
              ]}
            />
            {filteredUsers.length && organisations && !isLoading ? (
              <TableWrapper>
                <Table>
                  <THead>
                    <tr>
                      <th>
                        <Checkbox
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={selectAllCheckboxes}
                          disabled={!allPossibleUsersChoose.length}
                        />
                      </th>
                      <th>ORGANISATION</th>
                      <th>NAME</th>
                      <th>USERNAME</th>
                      <th>EMAIL</th>
                      <th>STATUS</th>
                      <th>TYPE</th>
                    </tr>
                  </THead>
                  <TBody>
                    {usersPagination.map((user, i) => {
                      const isOpenToTop = usersPagination.length > 4 && usersPagination.length - i < 4;

                      return (
                        <TRow
                          key={i}
                          isChecked={
                            !!selectedUsers.find(({ id }) => id === user.id)
                          }
                        >
                          <th>
                            <Checkbox
                              type="checkbox"
                              disabled={
                                user.id === currentUser?.id
                                || (isActiveMod !== undefined
                                  ? isActiveMod !== user.isUserActive
                                  : false)
                              }
                              checked={
                                !!selectedUsers.find(({ id }) => id === user.id)
                              }
                              onChange={({ target }) => onCheckboxClick(target.checked, user)}
                            />
                          </th>
                          <TableThCell
                            isOpenToTop={isOpenToTop}
                          >
                            {organisations?.find(
                              ({ id }) => user.organisationIds[0]?.organisationId === id,
                            )?.name || '-'}
                          </TableThCell>
                          <TableThCell
                            isOpenToTop={isOpenToTop}
                          >
                            {[user.firstName || '', user.lastName || ''].join(' ').trim()}
                          </TableThCell>
                          <TableThCell
                            isOpenToTop={isOpenToTop}
                          >
                            {user.username || '-'}
                          </TableThCell>
                          <TableThCell
                            isOpenToTop={isOpenToTop}
                          >
                            {user.email || '-'}
                          </TableThCell>
                          <th>
                            <StatusCell isActive={user.isUserActive}>
                              {user.isUserActive
                                ? UserStatus.ACTIVE
                                : UserStatus.INACTIVE}
                            </StatusCell>
                          </th>
                          <TH>{roleToText(user.role) || '-'}</TH>
                        </TRow>
                      );
                    })}
                  </TBody>
                </Table>
              </TableWrapper>
            ) : (
              <NoFound />
            )}
          </div>
          {!!filteredUsers.length && (
            <Pagination
              changePage={setOffset}
              currentPage={calculatedOffset}
              maxPages={maxPages}
              maxElements={filteredUsers.length}
              limits={limits}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </Content>
        {selectedUsers.length ? (
          <PopUp>
            <OrganisationsCount>
              <UsersIcon />
              {`${getNounByForm(selectedUsers.length, 'User')} selected`}
            </OrganisationsCount>
            <ButtonWrap>
              <Button
                onClick={handleActivateUser}
                isRedButton={selectedUsers[0].isUserActive}
                style={{ width: '140px' }}
              >
                {isStatusLoading ? (
                  <Loader size={24} thickness={2} color="#fff" />
                ) : selectedUsers[0].isUserActive ? (
                  'Deactivate'
                ) : (
                  'Activate'
                )}
              </Button>
            </ButtonWrap>
            <Actions>
              <StyledCloseIcon handler={clearAllSelectedUsers} />
            </Actions>
          </PopUp>
        ) : (
          ''
        )}
        {isModal && (
          <Modal closeModal={handleCloseModal}>
            <DeactivateModal
              title="Deactivate User?"
              subTitle={deactivateUserText}
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
                onConfirm: handleChangeStatus,
                name: 'Yes',
                isLoading: isStatusLoading,
                style: {
                  isRedButton: true,
                  style: { width: '90px', height: '48px', fontSize: '16px' },
                },
              }}
            />
          </Modal>
        )}
      </LoadingContainer>
    </PageContainer>
  );
};

const ButtonWrap = styled.div`
  margin-left: auto;
`;

const PopUp = styled.div`
  position: fixed;
  bottom: 100px;
  left: calc(50% + 256px / 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 86px 38px 32px;
  max-width: 822px;
  width: 100%;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 12px 80px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const OrganisationsCount = styled.p`
  display: flex;
  align-items: center;
  grid-gap: 13px;
`;

const Actions = styled.ul`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const StatusCell = styled.span<{ isActive: boolean }>`
  display: block;
  padding: 4px 6px;
  width: fit-content;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  background-color: ${({ isActive }) => (isActive
    ? 'var(--primary-green-background-color)'
    : 'var(--primary-red-background-color)')};
  color: ${({ isActive }) => (isActive ? 'var(--primary-green-color)' : 'var(--primary-red-color)')};
`;

const TH = styled.th`
  text-transform: capitalize;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);

  p {
    color: rgba(17, 24, 39, 0.7);
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
`;

const TableWrapper = styled.div`
  margin-bottom: 1rem;
  overflow-x: auto;
`;

const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
    overflow: hidden;
  }
`;

const THead = styled.thead`
  background-color: #f9f9f9;

  th {
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
    text-transform: uppercase;
    text-align: left;

    :first-child {
      padding: 12px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const TBody = styled.tbody`
  th {
    padding: 14px 35px 14px 0;
    max-width: 200px;
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    white-space: normal;

    :first-child {
      padding-left: 12px;
    }
  }
`;

const TRow = styled.tr<{ isChecked: boolean }>`
  cursor: pointer;

  th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#fff')};
  }

  :hover th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#F9F9F9')};
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
`;

export default Users;
