import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface IReport {
  orderId: string;
  orderDate: string;
  organisation: string;
  organisationId: number;
  user: string;
  userId: number;
  matter: string;
  service: string;
  searchDetails: string;
  totalEx?: string;
  gst?: string;
  totalInc: string | null;
  dateCompleted: string;
}

interface ReportsState {
  reports: IReport[] | null,
  isReportsLoading: boolean,
}

const InitialState: ReportsState = {
  reports: null,
  isReportsLoading: false,
};

export class ReportsReducer extends ImmerReducer<ReportsState> {
  setReports(reports: IReport[] | null) {
    this.draftState.reports = reports;
  }

  setIsReportsLoading(isReportsLoading: boolean) {
    this.draftState.isReportsLoading = isReportsLoading;
  }
}

export default createReducerFunction(ReportsReducer, InitialState);
