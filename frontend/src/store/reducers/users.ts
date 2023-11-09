import { createReducerFunction, ImmerReducer } from 'immer-reducer';

import { IPinedServices } from '@/pages/AllServices';

import { ISettings, Roles } from '@/store/reducers/user';

import { ExistingRegions } from '@/utils/getRegionsData';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IOrganisationId {
  isActive: boolean;
  organisationId: number;
  role: Roles;
  userId: number;
}

export interface IOrganisationUser {
  email: string,
  name: string,
  isEmailVerified: boolean,
  state: ExistingRegions
  role: Roles,
  id: number,
  firstName: string,
  lastName: string,
  username: string,
  phone: string,
  organisation: number,
  isUserActive: boolean,
  pinnedServices: IPinedServices
  userSettings: ISettings
  organisationIds: IOrganisationId[]
  branch: string
}

interface UsersState {
  users: IOrganisationUser[]
}

const InitialState: UsersState = {
  users: [],
};

export class UsersReducer extends ImmerReducer<UsersState> {
  public setUsers(value: IOrganisationUser[]) {
    this.draftState.users = value;
  }
}

export default createReducerFunction(UsersReducer, InitialState);
