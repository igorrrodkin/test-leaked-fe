import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface ICreateNotice {
  subject: string,
  message: string,
  startDate: number,
  endDate?: number
}

export interface INotice {
  id: number,
  createdAt: string,
  isActive: boolean,
  subject: string,
  message: string,
  startDate: string,
  endDate?: string
}

interface NoticesState {
  notices: INotice[] | null,
  activeNotices: INotice[] | null
}

const InitialState: NoticesState = {
  notices: null,
  activeNotices: null,
};

export class NoticesReducer extends ImmerReducer<NoticesState> {
  public setNotices(value: INotice[] | null) {
    this.draftState.notices = value;
  }

  public setActiveNotices(value: INotice[] | null) {
    this.draftState.activeNotices = value;
  }
}

export default createReducerFunction(NoticesReducer, InitialState);
