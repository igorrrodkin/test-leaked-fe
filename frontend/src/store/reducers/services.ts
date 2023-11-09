import { createReducerFunction, ImmerReducer } from 'immer-reducer';

import { IPinedServices } from '@/pages/AllServices';

import { ExistingRegions } from '@/utils/getRegionsData';

export enum FullfilmentType {
  MANUAL = 'manual',
  AUTO = 'auto',
}

export interface IService {
  id: number;
  region: ExistingRegions;
  productId: string;
  searchType: string;
  label: string;
  supplier: string;
  group: string;
  subgroup: string;
  description: string;
  serviceDisclaimer: string;
  searchResultDisclaimer: string;
  fulfilmentType: FullfilmentType;
  status: boolean;
}

export interface IUpdateServiceInOrganisation {
  organisationId: number,
  productId: string,
  isActive: boolean,
}

export interface IChangeServiceStatus {
  status: boolean,
  productIds: string[],
}

export interface IServiceUpdated {
  supplier: string,
  searchType: string,
  label: string,
  group: string,
  subgroup: string,
  description: string,
  serviceDisclaimer: string,
  searchResultDisclaimer: string,
  status: boolean,
  region: string,
}

export interface ICreateService {
  productId: string,
  supplier: string,
  searchType: string,
  label: string,
  group: string,
  subgroup: string,
  description: string,
  serviceDisclaimer: string,
  searchResultDisclaimer: string,
  status: boolean,
  region: string,
}

export interface IOrganisationService extends IService {
  total: string,
  GST: string,
  priceInclGST: string,
  priceListId?: number,
  priceListName?: string,
  identifier?: string,
  infotip?: string,
}

interface ServicesState {
  services: IService[]
  servicesModal: boolean,
  isServicesLoading: boolean,
  pinnedServices: IPinedServices | null
  organisationServices: IOrganisationService[]
  userServices: any | null
  isUserServicesLoading: boolean
}

const InitialState: ServicesState = {
  services: [],
  isServicesLoading: false,
  servicesModal: false,
  pinnedServices: null,
  organisationServices: [],
  userServices: null,
  isUserServicesLoading: false,
};

export class ServicesReducer extends ImmerReducer<ServicesState> {
  setServices(services: IService[]) {
    this.draftState.services = services;
  }

  setOrganisationServices(organisationServices: IOrganisationService[]) {
    this.draftState.organisationServices = organisationServices;
  }

  setIsServicesLoading(isServicesLoading: boolean) {
    this.draftState.isServicesLoading = isServicesLoading;
  }

  setServicesModal(servicesModal: boolean) {
    this.draftState.servicesModal = servicesModal;
  }

  setPinedServices(pinnedServices: IPinedServices) {
    this.draftState.pinnedServices = pinnedServices;
  }

  setUserServices(userServices: IService[]) {
    this.draftState.userServices = userServices;
  }

  setIsUserServicesLoading(isUserServicesLoading: boolean) {
    this.draftState.isUserServicesLoading = isUserServicesLoading;
  }
}

export default createReducerFunction(ServicesReducer, InitialState);
