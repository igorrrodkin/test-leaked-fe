import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { getOrganisationsAction } from '@/store/actions/organisationsActions';
import { userActions } from '@/store/actions/userActions';

import {
  IAssignPriceList, IUploadPriceList, PriceListReducer,
} from '@/store/reducers/priceList';
import { PopupTypes } from '@/store/reducers/user';

export const priceListActions = createActionCreators(PriceListReducer);

export type PriceListActions = ReturnType<typeof priceListActions.setPriceLists>
| ReturnType<typeof priceListActions.setPriceListDetail>
| ReturnType<typeof priceListActions.setOrganisationPriceLists>;

export const getAllPriceListsAction = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const priceLists = await mainApiProtected.getPriceLists();
    dispatch(priceListActions.setPriceLists(priceLists));
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getPriceListsByOrganisationAction = (organisationId: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const priceLists = await mainApiProtected.getPriceListsByOrganisation(organisationId);
    dispatch(priceListActions.setOrganisationPriceLists(priceLists));
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getPriceListByIdAction = (id: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const priceList = await mainApiProtected.getPriceListById(id);
    dispatch(priceListActions.setPriceListDetail(priceList));
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

export const assignPriceListToOrganisationsAction = (
  isToday: boolean,
  body: IAssignPriceList[],
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.assignPriceListToOrganisation(body);

    await dispatch(getOrganisationsAction());

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success',
      additionalText: 'Price list has been assigned',
    }));
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

export const uploadPriceListAction = (
  body: IUploadPriceList,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.uploadPriceList(body);

    await dispatch(getAllPriceListsAction());
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

export const setDefaultPriceListAction = (
  id: number,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(priceListActions.setPriceLists(null));
    await mainApiProtected.setDefaultPriceList(id);
    dispatch(getAllPriceListsAction());
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
