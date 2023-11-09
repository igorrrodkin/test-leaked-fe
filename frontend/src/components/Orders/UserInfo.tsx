import React from 'react';
import styled from 'styled-components';

interface Props {
  firstName: string;
  lastName: string;
}

const UserInfo: React.FC<Props> = ({ firstName, lastName }) => (
  <UserInfoStyled>
    {`${firstName[0]}${lastName[0]}`}
    <UserNameHover>
      {firstName || ''}
      {' '}
      {lastName || ''}
    </UserNameHover>
  </UserInfoStyled>
);

const UserNameHover = styled.span``;

const UserInfoStyled = styled.span`
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
    top: 0%;
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

export default UserInfo;
