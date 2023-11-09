import { createActionCreators } from 'immer-reducer';

import { ISignUpBody } from '@/api/mainApi';

import { FILE_LINKS_DIVIDER } from '@/components/Dashboard/ManuallyFulfillment';

import { IPinedServices } from '@/pages/AllServices';

import { AsyncAction } from '@/store/actions/common';
import { servicesActions } from '@/store/actions/servicesActions';

import { IFullOrganisation } from '@/store/reducers/organisations';
import {
  IChangePasswordBody,
  ICreatedUser,
  IUpdatePasswordBody,
  IUpdateUserBody,
  Order,
  OrderDetails,
  PopupTypes,
  Roles,
  UserReducer,
} from '@/store/reducers/user';

import LocalStorage from '@/utils/localStorage';

export const userActions = createActionCreators(UserReducer);

export type UserActions =
  | ReturnType<typeof userActions.setOrders>
  | ReturnType<typeof userActions.setOrdersTotal>
  | ReturnType<typeof userActions.setMatters>
  | ReturnType<typeof userActions.setMattersTotal>
  | ReturnType<typeof userActions.setMattersLoadState>
  | ReturnType<typeof userActions.setMatterOrders>
  | ReturnType<typeof userActions.setMatterOrdersTotal>
  | ReturnType<typeof userActions.setMatterOrdersLoadState>
  | ReturnType<typeof userActions.setOrderDetails>
  | ReturnType<typeof userActions.setMatterDetails>
  | ReturnType<typeof userActions.setUser>
  | ReturnType<typeof userActions.setIsLoadingUser>
  | ReturnType<typeof userActions.setPriceList>
  | ReturnType<typeof userActions.setOrgUsers>
  | ReturnType<typeof userActions.setSelectedMatter>
  | ReturnType<typeof userActions.setPopup>
  | ReturnType<typeof userActions.setSettings>
  | ReturnType<typeof userActions.setPinedService>
  | ReturnType<typeof userActions.setVisitedMatterFrom>
  | ReturnType<typeof userActions.setVisitedOrderDetailsFrom>
  | ReturnType<typeof userActions.setVisitedListResultFrom>
  | ReturnType<typeof userActions.logout>;

export const registerAction = (body: ISignUpBody): AsyncAction => async (dispatch, _, { mainAuthApi }) => {
  try {
    await mainAuthApi.register(body);
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    throw Error(error);
  }
};

export const getUserSettings = (userId: number): AsyncAction => async (dispatch, _, { mainApiProtected }) => {
  try {
    const { userSettings, pinnedServices } = await mainApiProtected.getUser(
      userId,
    );

    dispatch(userActions.setSettings(userSettings));
    dispatch(userActions.setPinedService(pinnedServices));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    throw Error(error);
  }
};

export const getOrganisationDefaultSettingsAction = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const settings = await mainApiProtected.getOrganisationDefaultSettings();

    dispatch(userActions.setSettings(settings));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    throw Error(error);
  }
};

export const validateOtpAction = (username: string, otp: string): AsyncAction => (
  async (dispatch, _, { mainAuthApi }) => {
    try {
      await mainAuthApi.validateOtp(username, otp);
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
  }
);

export const loginAction = (username: string, password: string): AsyncAction => (
  async (dispatch, _, { mainAuthApi }) => {
    try {
      const { accessToken, refreshToken } = await mainAuthApi.login(
        username,
        password,
      );

      LocalStorage.setAccessToken(accessToken);
      LocalStorage.setRefreshToken(refreshToken);
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
  }
);

export const getResetLinkAction = (username: string): AsyncAction => (
  async (dispatch, _, { mainAuthApi }) => {
    try {
      await mainAuthApi.forgotPassword(username);
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
  }
);

export const updatePasswordAction = (body: IUpdatePasswordBody): AsyncAction => (
  async (dispatch, _, { mainAuthApiProtected }) => {
    try {
      await mainAuthApiProtected.updatePassword(body);
      dispatch(
        userActions.setPopup({
          type: PopupTypes.SUCCESS,
          mainText: 'Success',
          additionalText: 'Password have been updated',
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

      return Promise.reject(error);
    }
  }
);

export const changePasswordAction = (body: IChangePasswordBody): AsyncAction => (
  async (dispatch, _, { mainAuthApiProtected }) => {
    try {
      const { accessToken, refreshToken } = await mainAuthApiProtected.changePassword(body);

      LocalStorage.setAccessToken(accessToken);
      LocalStorage.setRefreshToken(refreshToken);
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
  }
);

export const updateUserAction = (userId: number, body: IUpdateUserBody): AsyncAction => (
  async (dispatch, _, { mainApiProtected }) => {
    try {
      await mainApiProtected.updateUser(userId, body);
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
  }
);

export const updateUserByAdminAction = (userId: number, body: IUpdateUserBody): AsyncAction => (
  async (dispatch, _, { mainApiProtected }) => {
    try {
      await mainApiProtected.updateUserByAdmin(userId, body);
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
  }
);

export const createUserAction = (body: ICreatedUser): AsyncAction => async (dispatch, _, { mainApiProtected }) => {
  try {
    await mainApiProtected.createUser(body);
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

export const getMeAction = (): AsyncAction => async (dispatch, _, { mainApiProtected }) => {
  try {
    const user = await mainApiProtected.getMe();

    dispatch(userActions.setUser(user));
    dispatch(
      servicesActions.setPinedServices(
        (user.pinnedServices || {}) as IPinedServices,
      ),
    );
    dispatch(userActions.setIsLoadingUser(false));
  } catch (error: any) {
    console.error(error);
    dispatch(userActions.logout());
    LocalStorage.clear();
    dispatch(userActions.setIsLoadingUser(false));

    return Promise.reject(error);
  }
};

export const getPriceListAction = (): AsyncAction => async (dispatch, getState, { mainApiProtected }) => {
  try {
    const orgId = getState().user.user!.organisations[0].id;
    const priceList = await mainApiProtected.getPriceList(orgId);

    dispatch(userActions.setPriceList(priceList));
  } catch (error: any) {
    console.error(error);
  }
};

export const getOrdersAction = (query?: string): AsyncAction => async (dispatch, getState, { mainApiProtected }) => {
  try {
    const {
      user: { user },
    } = getState();

    let roleQuery = '';

    if (user?.role !== Roles.SYSTEM_ADMIN) {
      if (typeof query === 'string' && query.search(/organisationId=\d+/) < 0) {
        roleQuery = `&organisationId=${user?.organisations[0].id}`;
      }
    }

    const ordersWithQuery = await mainApiProtected.getOrdersWithQuery(
      query + roleQuery,
    );

    dispatch(
      userActions.setOrders(ordersWithQuery.data as unknown as Order[]),
    );
    dispatch(userActions.setOrdersTotal(ordersWithQuery.count));
  } catch (error: any) {
    console.error(error);
  }
};

export const getMattersAction = (query?: string): AsyncAction => async (dispatch, getState, { mainApiProtected }) => {
  try {
    const {
      user: { user },
    } = getState();

    dispatch(userActions.setMattersLoadState(true));

    const roleQuery = user?.role === Roles.SYSTEM_ADMIN
      ? ''
      : `&organisationId=${user?.organisations[0].id}`;

    const mattersData = await mainApiProtected.getMattersWithQuery(
      query + roleQuery,
    );

    dispatch(userActions.setMatters(mattersData.data));
    dispatch(userActions.setMattersTotal(mattersData.count));
  } catch (error: any) {
    console.error(error);
  } finally {
    dispatch(userActions.setMattersLoadState(false));
  }
};

export const getOrderDetailsAction = (id: string): AsyncAction => async (dispatch, _, { mainApiProtected }) => {
  try {
    const orderDetails = await mainApiProtected.getOrderDetails(id);

    orderDetails.orderItems[0].link = orderDetails.orderItems[0].link?.split(FILE_LINKS_DIVIDER);

    dispatch(
      userActions.setOrderDetails(orderDetails as unknown as OrderDetails),
    );
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    return Promise.reject();
  }
};

export const getMatterDetailsAction = (id: string, organisationId: number): AsyncAction => (
  async (dispatch, _, { mainApiProtected }) => {
    try {
      let orderDetails = await mainApiProtected.getMatterDetails(id, organisationId);

      orderDetails = orderDetails.map((el) => {
        const link = el.orderItems[0].link
          ? el.orderItems[0].link.split(FILE_LINKS_DIVIDER)
          : [];

        const { orderItems } = el;
        orderItems[0].link = link;

        return {
          ...el,
          orderItems,
        };
      });

      dispatch(
        userActions.setMatterDetails(orderDetails as unknown as OrderDetails[]),
      );
    } catch (error: any) {
      console.error(error);

      return Promise.reject();
    }
  }
);

export const attachPaymentMethodToCustomerAction = (
  paymentMethodId: string,
  organisation: IFullOrganisation,
): AsyncAction => (
  async (dispatch, getState, { mainApiProtected }) => {
    try {
      if (!organisation.stripeCustomerId) {
        await mainApiProtected.addCardInitCustomer(organisation.id);
      }

      await mainApiProtected.attachPaymentMethodToCustomer(paymentMethodId, organisation.id);
      await dispatch(getMeAction());
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

      dispatch(userActions.setPopup({
        mainText: 'Error',
        additionalText: errorMessage,
        type: PopupTypes.ERROR,
      }));

      return Promise.reject();
    }
  }
);

export const setAsPrimaryCardAction = (
  customerId: string,
  methodId: string,
  shouldRefreshUser: boolean,
): AsyncAction => (
  async (dispatch, getState, { mainApiProtected }) => {
    try {
      await mainApiProtected.setAsPrimaryCard(customerId, methodId);
      if (shouldRefreshUser) await dispatch(getMeAction());
    } catch (error: any) {
      console.error(error);

      return Promise.reject();
    }
  }
);

export const removeCardAction = (id: string, organisationId: number): AsyncAction => (
  async (dispatch, getState, { mainApiProtected }) => {
    try {
      await mainApiProtected.removeCard(id, organisationId);
      await dispatch(getMeAction());
    } catch (error: any) {
      console.error(error);

      return Promise.reject(error);
    }
  }
);

export const logoutAction = (): AsyncAction => async (dispatch, _, { mainApiProtected }) => {
  try {
    await mainApiProtected.logout();
    dispatch(userActions.logout());
    LocalStorage.clear();
  } catch (error: any) {
    console.error(error);
  }
};
