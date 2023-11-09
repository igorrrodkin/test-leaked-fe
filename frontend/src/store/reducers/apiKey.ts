import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface ApiKeyQuery {
  orgId?: number,
}

export interface IApiKey {
  id: number,
  apiKey: string,
  userId: number,
  createdAt: string,
  isRevoked: boolean,
  lastUsedAt: string,
  orgId: number,
  orgName: string,
  usage: number,
  limit: number,
}

interface ApiKeyState {
  apiKeys: IApiKey[],
  apiKey: string | null,
}

const InitialState: ApiKeyState = {
  apiKeys: [],
  apiKey: null,
};

export class ApiKeyReducer extends ImmerReducer<ApiKeyState> {
  setApiKeys(value: IApiKey[]) {
    this.draftState.apiKeys = value;
  }

  setApiKey(value: string | null) {
    this.draftState.apiKey = value;
  }
}

export default createReducerFunction(ApiKeyReducer, InitialState);
