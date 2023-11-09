import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';

import { ReportsReducer } from '@/store/reducers/reports';

export const reportsActions = createActionCreators(ReportsReducer);

export type ReportsActions =
  | ReturnType<typeof reportsActions.setReports>
  | ReturnType<typeof reportsActions.setIsReportsLoading>;

export const getReportsAction = (query?: string): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(reportsActions.setIsReportsLoading(true));

    const reports = await mainApiProtected.getReports(query);

    dispatch(reportsActions.setReports(reports));
  } catch (error: any) {
    console.error(error);
  } finally {
    dispatch(reportsActions.setIsReportsLoading(false));
  }
};
