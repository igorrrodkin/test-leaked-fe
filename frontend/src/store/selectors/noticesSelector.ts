import { createSelector, Selector } from 'reselect';

import { INotice } from '@/store/reducers/notices';

import { State } from '@/store';

const userState = (state: State) => state.notices;

export const selectNotices: Selector<State, INotice[] | null> = createSelector(
  userState,
  ({ notices }) => notices,
);

export const selectActiveNotices: Selector<State, INotice[] | null> = createSelector(
  userState,
  ({ activeNotices }) => activeNotices,
);
