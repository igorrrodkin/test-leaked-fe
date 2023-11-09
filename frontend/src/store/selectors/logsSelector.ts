import { createSelector, Selector } from 'reselect';

import { IFullLog, ILog } from '@/store/reducers/logs';

import { State } from '@/store';

const logsState = (state: State) => state.logs;

export const selectLogs: Selector<State, { result: ILog[] | null, totalCount: number }> = createSelector(
  logsState,
  ({ logs }) => logs,
);

export const selectFullLog: Selector<State, [IFullLog] | null> = createSelector(
  logsState,
  ({ fullLog }) => fullLog,
);
