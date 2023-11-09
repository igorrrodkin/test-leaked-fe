import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export enum InvoiceStatuses {
  WAIT_FOR_PAY = 'Not Paid',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  OPEN = 'Open',
}

export enum PaymentMethod {
  CARD = 'card',
}

export enum PaymentType {
  MANUAL = 'manual',
  THRESHOLD = 'threshold',
  MONTHLY = 'monthly',
  INVOICE = 'invoice',
}

/* export interface IInvoice {
  id: number,
  month: string,
  invoiceNumber: string,
  previousMonthBalance: string,
  refundsSum: string,
  cost: string,
  paymentSum: string,
  endBalance: string,
  orgId: number,
  payed: boolean,
} */

export interface ISummary {
  balanceFromPreviousMonth: number;
  cost: number;
  paymentAndCredits: number;
  currentBalance: number;
  openBalance: number;
  threshold: number;
  paymentMethods?: {
    id: string;
    last4: string;
    brand: string;
    default: boolean;
  }[]
}

export interface IAllSummary {
  id: number;
  name: string;
  accountLimit: number;
  currentBalance: number;
  openBalance: number;
  paymentThreshold: number;
  paymentType: string;
  inArrears: boolean;
  osSuspended: boolean;
}

export interface IInvoice {
  organisationId: number,
  orgName: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  daysOverdue: number;
  amount: number;
  paid: number;
  balance: number;
  invoiceId: number;
  invoiceNumber: string;
  status: string;
}

export interface IPaymentCredits {
  creditId: number;
  orgId: number;
  date: string;
  orgName: string;
  type: string;
  amount: number;
  reference?: string;
  description?: string;
  allocated: {
    amount: number;
    withdrawalId: number | null;
    invoiceNumber: string | null;
  }[];
  credit: number;
}

export interface IPayment {
  amount: string,
  dateReceived: string,
  method: PaymentMethod,
  receiptNumber: string,
  type: PaymentType,
}

export interface IInvoiceDetailsMatter {
  matter: string,
  gst: number,
  totalEx: number,
  totalInc: number,
  orgId: number,
}

export interface IInvoiceDetailsOrder {
  orderId: string,
  orderDate: string,
  dateCompleted: string,
  matter: string,
  searchDetails: string,
  service: string,
  gst: string,
  totalEx: string,
  totalInc: string,
  orgId: number,
}

export interface IInvoiceDetailsRefund {
  orderId: string,
  orderDate: string,
  dateRefunded: string,
  matter: string,
  searchDetails: string,
  service: string,
  gst: string,
  totalEx: string,
  totalInc: string,
  orgId: number,
}

export interface IInvoiceDetails {
  id: number,
  invoiceNumber: string,
  orders: IInvoiceDetailsOrder[],
  pricesByMatter: IInvoiceDetailsMatter[],
  payments: IPayment[],
  refunds: IInvoiceDetailsRefund[],
}

export type INewInvoiceDetailsOrders = {
  createdAt: string;
  completedAt: string;
  orderId: string;
  matter: string;
  service: string;
  searchDetails: string;
  totalInc: number;
  totalEx: number;
  gst: number;
  orgId: number;
};

export type INewInvoiceDetailsMatters = {
  matter: string;
  totalEx: number;
  gst: number;
  totalInc: number;
  orgId: number;
};

export type INewInvoiceDetailsRefunds = {
  date: string | null;
  type: string | null;
  last4: string | null;
  description: string | null;
  amount: number;
};

export interface INewInvoiceDetails {
  orders: INewInvoiceDetailsOrders[];
  matters: INewInvoiceDetailsMatters[];
  refunds: INewInvoiceDetailsRefunds[];
  presignedUrl: string;
}

interface BillingState {
  summary: ISummary | null,
  invoices: IInvoice[] | null,
  paymentCredits: IPaymentCredits[] | null,
  invoiceDetails: INewInvoiceDetails | null,
}

const InitialState: BillingState = {
  summary: null,
  invoices: null,
  paymentCredits: null,
  invoiceDetails: null,
};

export class BillingReducer extends ImmerReducer<BillingState> {
  setSummary(value: ISummary | null) {
    this.draftState.summary = value;
  }

  setInvoices(value: IInvoice[] | null) {
    this.draftState.invoices = value;
  }

  setPaymentCredits(value: IPaymentCredits[] | null) {
    this.draftState.paymentCredits = value;
  }

  setInvoiceDetails(value: INewInvoiceDetails | null) {
    this.draftState.invoiceDetails = value;
  }
}

export default createReducerFunction(BillingReducer, InitialState);
