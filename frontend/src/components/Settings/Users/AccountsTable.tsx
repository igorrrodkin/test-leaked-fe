import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import DeleteIcon from '@/assets/icons/DeleteIcon';
import EditIcon from '@/assets/icons/EditIcon';

import {
  ActionsCell,
  Table,
  TableWrapper,
  TBody,
  THead,
  TRow,
  TTd,
  TTh,
} from '@/pages/Notices';

import { Roles } from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

import { selectUser } from '@/store/selectors/userSelectors';

import roleToText from '@/utils/roleToText';

interface IAccountsTable {
  usersToShow: IOrganisationUser[];
  handleEditUser: (key: IOrganisationUser) => void;
  handleDeleteUser: (key: IOrganisationUser) => void;
}

const tableHeaderLabels = [
  'USER',
  'NAME',
  'USERNAME',
  'TYPE',
  'ACTION',
];

const AccountsTable: React.FC<IAccountsTable> = ({
  usersToShow,
  handleEditUser,
  handleDeleteUser,
}) => {
  const me = useSelector(selectUser);

  return ((
    <TableWrapper>
      <Table>
        <THead>
          <tr>
            {tableHeaderLabels.map((label) => (
              <TTh key={`${label}reports`}>{label}</TTh>
            ))}
          </tr>
        </THead>
        <TBody>
          {usersToShow.map((user, i) => (
            <TRow key={user.id + i * 1000}>
              <TTd>
                <UserInfo>{`${user.firstName[0]}${user.lastName[0]}`}</UserInfo>
              </TTd>
              <TTd isPreLine>
                {user.firstName}
                {' '}
                {user.lastName}
              </TTd>
              <TTd>
                {user.username
                  || `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.replaceAll(
                    ' ',
                    '_',
                  )}
              </TTd>
              <TTd>{roleToText(user.role) || '-'}</TTd>
              <ActionsCell>
                <Info
                  isDisabled={user.role === Roles.SYSTEM_ADMIN}
                  onClick={() => handleEditUser(user)}
                >
                  <EditIcon />
                </Info>
                <Info
                  isDisabled={user.role === Roles.SYSTEM_ADMIN || user.id === me?.id}
                  onClick={() => handleDeleteUser(user)}
                >
                  <DeleteIcon />
                </Info>
              </ActionsCell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </TableWrapper>
  ));
};

const Info = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: #f1efe9;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : 1)};

  :hover {
    background-color: ${({ isDisabled }) => (isDisabled ? '#f1efe9' : '#e1dfd9')};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const UserInfo = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  font-weight: 500;
  border-radius: 50%;
  background-color: rgb(229, 231, 235);

  position: relative;

  & > span {
    position: absolute;
    top: 0;
    left: 20px;
    transform: translate(-0%, -50%);
    opacity: 0;
    visibility: hidden;
    z-index: -1;

    transition: all 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      & > span {
        display: block;
        opacity: 1;
        visibility: visible;
        z-index: 1;
        padding: 5px 10px;
        background: #ffffff;
        border-radius: 2px;
      }
    }
  }
`;

export default AccountsTable;
