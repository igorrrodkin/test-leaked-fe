import { createSelector, Selector } from 'reselect';

import { IApiKey } from '@/store/reducers/apiKey';

import { State } from '@/store';

const apiKeyState = (state: State) => state.apiKey;

export const selectApiKeys: Selector<State, IApiKey[]> = createSelector(
  apiKeyState,
  ({ apiKeys }) => apiKeys,
);

export const selectApiKey: Selector<State, string | null> = createSelector(
  apiKeyState,
  ({ apiKey }) => apiKey,
);
