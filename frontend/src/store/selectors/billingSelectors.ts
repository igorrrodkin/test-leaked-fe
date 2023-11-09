import { createSelector, Selector } from 'reselect';

import {
  IInvoice, INewInvoiceDetails, IPaymentCredits, ISummary,
} from '@/store/reducers/billing';

import { State } from '@/store';

const billingState = (state: State) => state.billing;

export const selectSummary: Selector<State, ISummary | null> = createSelector(
  billingState,
  ({ summary }) => summary,
);

export const selectInvoices: Selector<State, IInvoice[] | null> = createSelector(
  billingState,
  ({ invoices }) => invoices,
);

export const selectPaymentCredit: Selector<State, IPaymentCredits[] | null> = createSelector(
  billingState,
  ({ paymentCredits }) => paymentCredits,
);

export const selectInvoiceDetails: Selector<State, INewInvoiceDetails | null> = createSelector(
  billingState,
  ({ invoiceDetails }) => invoiceDetails,
);
