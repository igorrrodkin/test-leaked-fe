import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { userActions } from '@/store/actions/userActions';

import { LogsReducer } from '@/store/reducers/logs';
import { PopupTypes } from '@/store/reducers/user';

export const logsActions = createActionCreators(LogsReducer);

export type LogsActions =
  | ReturnType<typeof logsActions.setLogs>
  | ReturnType<typeof logsActions.setFullLog>;

export const getLogsAction = (query?: string): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const logs = await mainApiProtected.getLogs(query);

    dispatch(logsActions.setLogs(logs));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    return Promise.reject(error);
  }
};

export const getFullLogAction = (id: string): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const log = await mainApiProtected.getFullLog(id);

    dispatch(logsActions.setFullLog(log));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    return Promise.reject(error);
  }
};
