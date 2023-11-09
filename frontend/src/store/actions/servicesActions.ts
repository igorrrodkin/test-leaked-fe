import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { orderActions } from '@/store/actions/orderActions';
import { userActions } from '@/store/actions/userActions';

import { TFoundedItems } from '@/store/reducers/order';
import {
  FullfilmentType,
  IChangeServiceStatus,
  ICreateService,
  IOrganisationService,
  IServiceUpdated, IUpdateServiceInOrganisation,
  ServicesReducer,
} from '@/store/reducers/services';
import { PopupTypes } from '@/store/reducers/user';

import getRegionsData, { topSectionProductCodes } from '@/utils/getRegionsData';
import inputsConfig from '@/utils/inputsConfig';
import isFormChanged from '@/utils/isFormChanged';
import LocalStorage from '@/utils/localStorage';

export const servicesActions = createActionCreators(ServicesReducer);

export type ServicesActions =
  | ReturnType<typeof servicesActions.setServices>
  | ReturnType<typeof servicesActions.setPinedServices>
  | ReturnType<typeof servicesActions.setIsServicesLoading>
  | ReturnType<typeof servicesActions.setUserServices>
  | ReturnType<typeof servicesActions.setIsUserServicesLoading>
  | ReturnType<typeof servicesActions.setOrganisationServices>
  | ReturnType<typeof servicesActions.setServicesModal>;

export const getServices = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(servicesActions.setIsServicesLoading(true));

    const services = await mainApiProtected.getServices();

    dispatch(servicesActions.setServices(services));

    dispatch(servicesActions.setIsServicesLoading(false));
  } catch (error: any) {
    console.error(error);
  }
};

export const getOrganisationServices = (organisationId: number): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const currentPriceList = getState().user.priceList;
    const { initialOrderData } = getState().order;

    const promiseResults = await Promise.all([
      mainApiProtected.getOrganisationServices(organisationId),
      currentPriceList || mainApiProtected.getPriceList(organisationId),
    ]);

    const servicesList = promiseResults[0];
    const priceList = promiseResults[1];
    const results: IOrganisationService[] = [];
    const services: IOrganisationService[] = [];

    const matchedServices: IOrganisationService[] = [];

    priceList.priceList.forEach(({
      productCode,
      priceExGST,
      GST,
      priceInclGST,
    }) => {
      const service = servicesList.find((s) => s.productId === productCode);

      if (service) {
        const matched = {
          ...service,
          priceExGST,
          GST,
          priceInclGST,
        };

        const isTop = topSectionProductCodes.includes(service.productId);

        matchedServices.push(matched);

        if (isTop || service.fulfilmentType === FullfilmentType.AUTO) {
          services.push(matched);
        }

        if (service.fulfilmentType === FullfilmentType.MANUAL) {
          if (!Object.keys(inputsConfig).includes(service.productId) && !isTop) return;
          results.push(matched);
        }
      }
    });

    dispatch(servicesActions.setOrganisationServices(matchedServices));

    const manualProducts: TFoundedItems = {};
    const recentServices = LocalStorage.getRecentServices().map((el) => {
      const service = matchedServices.find((s) => s.productId === el.productId);

      if (service && isFormChanged(el, service)) return service;

      return el;
    });

    LocalStorage.setRecentServices(recentServices);

    results.forEach((el) => {
      manualProducts[el.productId] = [];
    });

    dispatch(orderActions.setOrderManuallyProducts(manualProducts));
    dispatch(orderActions.setProducts(results));
    dispatch(orderActions.setServices(services));
    dispatch(userActions.setPriceList(priceList));

    if (!initialOrderData) {
      const regionData = getRegionsData()[0];
      let initialService = 0;

      for (let i = 0; i < regionData.services.length; i += 1) {
        const el = regionData.services[i];
        const foundedService = services.find((service) => el.productId === service.productId);

        if (foundedService) {
          initialService = i;
          break;
        }
      }

      dispatch(orderActions.setSelectedService(initialService >= 0 ? initialService : 0));
    }
  } catch (error: any) {
    console.error(error);
  }
};

export const changeServiceStatusInOrganisation = (body: IUpdateServiceInOrganisation[]): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.changeServiceStatusInOrganisation(body);
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getUserServices = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    dispatch(servicesActions.setIsUserServicesLoading(true));

    const userServices = await mainApiProtected.getUserServices();

    dispatch(servicesActions.setUserServices(userServices));

    dispatch(servicesActions.setIsUserServicesLoading(false));
  } catch (error: any) {
    console.error(error);
  }
};

export const createService = (body: ICreateService): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const orgId = getState().user.user!.organisations[0].id;

    dispatch(servicesActions.setIsUserServicesLoading(true));

    await mainApiProtected.createService(body);

    const [userServices] = await Promise.all([
      mainApiProtected.getUserServices(),
      dispatch(getOrganisationServices(orgId)),
    ]);

    dispatch(servicesActions.setUserServices(userServices));
    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success Add New Service',
      additionalText: 'Service has been added',
    }));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
  }
};

export const updateService = (
  productId: string,
  body: IServiceUpdated,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const orgId = getState().user.user!.organisations[0].id;

    dispatch(servicesActions.setIsUserServicesLoading(true));

    await mainApiProtected.updateService(productId, body);

    const [userServices] = await Promise.all([
      mainApiProtected.getUserServices(),
      dispatch(getOrganisationServices(orgId)),
    ]);

    dispatch(servicesActions.setUserServices(userServices));

    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(
      userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success update Product',
        additionalText: 'Product has been updated',
      }),
    );
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
  }
};

export const deleteService = (productId: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.deleteService(productId);

    const userServices = await mainApiProtected.getUserServices();

    dispatch(servicesActions.setUserServices(userServices));

    dispatch(
      userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success delete Service',
        additionalText: 'Service has been deleted',

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
  }
};

export const changeStatusServicesAction = (updatedServices: IChangeServiceStatus): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const orgId = getState().user.user!.organisations[0].id;

    dispatch(servicesActions.setIsUserServicesLoading(true));

    await mainApiProtected.updateServicesStatus(updatedServices);

    const [userServices] = await Promise.all([
      mainApiProtected.getUserServices(),
      dispatch(getOrganisationServices(orgId)),
    ]);

    dispatch(servicesActions.setUserServices(userServices));

    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(
      userActions.setPopup({
        type: PopupTypes.SUCCESS,
        mainText: 'Success update Statuses',
        additionalText: 'Statuses have been updated',
      }),
    );
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(servicesActions.setIsUserServicesLoading(false));

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
  }
};
