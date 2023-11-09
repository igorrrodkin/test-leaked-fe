import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface ILog {
  apiKey: string;
  date: string;
  id: number;
  logId: string;
  method: string;
  orderId: string;
  orgId: number;
  query: string;
  path: string;
  statusCode: number;
  userId: number;
  vendorStatus: number;
  username: string;
  orgName: string;
}

export interface IFullLog {
  requestInfo: {
    apiKey: string;
    method: string;
    orgId: number;
    query: string;
    path: string;
    statusCode: number;
    userId: number;
    vendorStatus: number;
    requestDate: string;
    headers: { [key: string]: string | { [key: string]: string } } | '';
  } | null;
  responseInfo: {
    statusCode: number;
    data: {
      data: {
        message: string;
        statusCode: string;
      };
      isError: boolean;
      status: number;
    };
    duration: string;
    orderId: string;
    responseDate: string;
    headers: { [key: string]: string | { [key: string]: string } } | '';
  } | null;
  serverResponse?: {
    statusCode: number;
    data: {};
    responseId: number;
    organisationId: number;
    orderId: string;
    userId: number;
    path: string;
    params: string;
    duration: string;
    responseDate?: string;
    userNotification: string | null;
  } | null;
  clientRequest?: {
    path: string;
    query: string | null;
    method: string;
    apiKey: string | null;
    requestDate?: string;
    headers: { [key: string]: string | { [key: string]: string } } | '';
    body: {};
  } | null;
}

interface LogsState {
  logs: { result: ILog[] | null; totalCount: number };
  fullLog: [IFullLog] | null;
}

const InitialState: LogsState = {
  logs: { result: null, totalCount: 0 },
  fullLog: null,
};

export class LogsReducer extends ImmerReducer<LogsState> {
  setLogs(logs: { result: ILog[] | null; totalCount: number }) {
    this.draftState.logs = logs;
  }

  setFullLog(log: [IFullLog] | null) {
    this.draftState.fullLog = log;
  }
}

export default createReducerFunction(LogsReducer, InitialState);
