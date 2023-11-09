import { createSelector, Selector } from 'reselect';

import { IOrganisationUser } from '@/store/reducers/users';

import { State } from '@/store';

const userState = (state: State) => state.users;

export const selectUsers: Selector<State, IOrganisationUser[]> = createSelector(
  userState,
  ({ users }) => users,
);
