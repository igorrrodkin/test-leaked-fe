import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { userActions } from '@/store/actions/userActions';

import { BillingReducer } from '@/store/reducers/billing';
import { PopupTypes } from '@/store/reducers/user';

export const billingActions = createActionCreators(BillingReducer);

export type InvoiceActions = ReturnType<typeof billingActions.setSummary>
| ReturnType<typeof billingActions.setInvoices>
| ReturnType<typeof billingActions.setPaymentCredits>
| ReturnType<typeof billingActions.setInvoiceDetails>;

export const getSummaryAction = (orgId?: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const invoices = await mainApiProtected.getSummary(orgId);

    dispatch(billingActions.setSummary(invoices));
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

export const getInvoicesAction = (orgId?: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const invoices = await mainApiProtected.getInvoices(orgId);

    dispatch(billingActions.setInvoices(invoices));
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

export const getPaymentCreditsAction = (orgId?: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const paymentCredits = await mainApiProtected.getPaymentCredits(orgId);

    dispatch(billingActions.setPaymentCredits(paymentCredits));
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

export const payNowAction = (orgId: number, invoiceNumber: string, getAllInvoices?: boolean): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.payNow(invoiceNumber, orgId);
    if (getAllInvoices) {
      await dispatch(getInvoicesAction());
    } else {
      await dispatch(getInvoicesAction(orgId));
    }
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

export const getInvoiceDetailsAction = (invoiceNumber: string): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const details = await mainApiProtected.getInvoiceDetails(invoiceNumber);

    dispatch(billingActions.setInvoiceDetails(details));
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
