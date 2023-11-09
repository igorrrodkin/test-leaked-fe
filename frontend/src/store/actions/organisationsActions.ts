import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { getMeAction, userActions } from '@/store/actions/userActions';

import {
  ICreateOrganisation,
  IEditOrganisation,
  IUpdateOrganisationRequest,
  OrganisationsReducer,
} from '@/store/reducers/organisations';
import { PopupTypes } from '@/store/reducers/user';

export const organisationsActions = createActionCreators(OrganisationsReducer);

export type OrganisationsActions = ReturnType<typeof organisationsActions.setOrganisations>
| ReturnType<typeof organisationsActions.setBaseOrganisationsInfo>
| ReturnType<typeof organisationsActions.setOrganisationDetails>
| ReturnType<typeof organisationsActions.setOrganisationServices>
| ReturnType<typeof organisationsActions.setIsLoading>;

export const getBaseOrganisationsInfoAction = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(organisationsActions.setIsLoading(true));
    const organisations = await mainApiProtected.getBaseOrganisationsInfo();

    dispatch(organisationsActions.setBaseOrganisationsInfo(organisations));
    dispatch(organisationsActions.setIsLoading(false));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
    dispatch(organisationsActions.setIsLoading(false));
  }
};

export const getOrganisationsAction = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(organisationsActions.setIsLoading(true));
    const organisations = await mainApiProtected.getOrganisations();

    dispatch(organisationsActions.setOrganisations(organisations));
    dispatch(organisationsActions.setIsLoading(false));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    dispatch(organisationsActions.setIsLoading(false));
  }
};

export const editOrganisationsAction = (body: IEditOrganisation): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    dispatch(organisationsActions.setIsLoading(true));

    await mainApiProtected.editOrganisation(body);
    await dispatch(getOrganisationsAction());

    dispatch(organisationsActions.setIsLoading(false));
  } catch (error: any) {
    console.error(error);
    dispatch(organisationsActions.setIsLoading(false));
    return Promise.reject(error);
  }
};

export const getOrganisationServices = (organisationId: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const services = await mainApiProtected.getOrganisationServices(organisationId);

    dispatch(organisationsActions.setOrganisationServices(services));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
  }
};

export const createOrganisationAction = (body: ICreateOrganisation): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.createOrganisation(body);
    await dispatch(getOrganisationsAction());
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    throw Error();
  }
};

export const getOrganisationDetailsAction = (id: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const organisation = await mainApiProtected.getOrganisation(id);

    dispatch(organisationsActions.setOrganisationDetails(organisation));
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

export const updateOrganisation = (
  organisationId: number,
  body: IUpdateOrganisationRequest,
  isUserSettings: boolean = false,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const organisation = await mainApiProtected.updateOrganisation(organisationId, body);

    if (isUserSettings) {
      await dispatch(getMeAction());
    } else {
      dispatch(organisationsActions.setOrganisationDetails(organisation));
    }

    dispatch(
      userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success',
        additionalText: 'Organisation has been updated',
      }),
    );
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    throw Error();
  }
};
