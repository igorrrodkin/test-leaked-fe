import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { userActions } from '@/store/actions/userActions';

import { ApiKeyQuery, ApiKeyReducer } from '@/store/reducers/apiKey';
import { PopupTypes } from '@/store/reducers/user';

import { getQueries } from '@/utils/api';

export const apiKeyActions = createActionCreators(ApiKeyReducer);

export type ApiKeyActions = ReturnType<typeof apiKeyActions.setApiKeys>
| ReturnType<typeof apiKeyActions.setApiKey>;

export const getApiKeysAction = (query?: ApiKeyQuery): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const apiKeys = await mainApiProtected.getApiKeys(query ? getQueries(query) : '');

    dispatch(apiKeyActions.setApiKeys(apiKeys));
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

export const generateApiKeyAction = (orgId: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const { apiKey } = await mainApiProtected.generateApiKey(orgId);

    await dispatch(getApiKeysAction({
      orgId,
    }));

    dispatch(apiKeyActions.setApiKey(apiKey));
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

export const revokeApiKeyAction = (id: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.revokeApiKey(id);
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
