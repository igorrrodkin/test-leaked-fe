import { createSelector, Selector } from 'reselect';

import { IReport } from '@/store/reducers/reports';

import { State } from '@/store';

const reportsState = (state: State) => state.reports;

export const selectReports: Selector<State, IReport[] | null> = createSelector(
  reportsState,
  ({ reports }) => reports,
);

export const selectIsReportsLoading: Selector<State, boolean> = createSelector(
  reportsState,
  ({ isReportsLoading }) => isReportsLoading,
);
