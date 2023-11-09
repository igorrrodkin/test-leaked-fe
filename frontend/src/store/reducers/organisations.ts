import { createReducerFunction, ImmerReducer } from 'immer-reducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from 'stripe';

import { InvoiceFrequency, PaymentTerms, PaymentTypes } from '@/components/OrganisationSettings/OrganisationDetails';

import { IOrganisationService } from '@/store/reducers/services';

import { ExistingRegions } from '@/utils/getRegionsData';

export enum EOrganisationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING_REVIEW = 'Pending review',
}

interface IPriceList {
  name: string,
  isActive: boolean,
  priceListName: number,
  organisationId: number,
  effectiveFromDate: string,
  id: number,
}

export interface IOrganisation {
  id: number,
  name: string,
  orgStatus: EOrganisationStatus,
  lastOrderDate?: string,
  paymentType: string,
  currentPriceList: IPriceList,
  futurePriceList?: IPriceList
}

export interface IFullOrganisation {
  accountType: string
  billingCycle: string
  billingMethod: string
  paymentTermsMethod: string
  email: string
  fax: string
  financeEmail: string
  flatUnit: string
  houseNumber: string
  id: number
  isActive: boolean
  name: string
  phone: string
  postcode: string
  primaryContact: string
  state: ExistingRegions
  street: string
  suburb: string
  typeOfBusiness: string
  paymentType: PaymentTypes
  paymentThreshold: string
  abn: string
  stripeCustomerId?: string
  stripePaymentMethods: Stripe.PaymentMethod[]
  stripePrimaryPaymentMethod: any
  accountLimit: number;
  paymentTerms: string;
  invoiceFrequency: string;
}

export interface IEditOrganisation {
  status: EOrganisationStatus,
  orgIds: number[],
}

export interface IUpdateOrganisationRequest {
  abn: string;
  name: string;
  email: string;
  phone: string;
  financeEmail: string;
  paymentType: PaymentTypes;
  invoiceFrequency: InvoiceFrequency;
  paymentTerms: PaymentTerms;
  paymentThreshold?: number;
  flatUnit: string;
  houseNumber: string;
  street: string;
  suburb: string;
  state: ExistingRegions;
  postcode: string;
  primaryContact: string;
  accountLimit?: number;
}

export interface ICreateOrganisation {
  abn: string;
  name: string;
  email: string;
  phone: string;
  financeEmail: string;
  paymentType: PaymentTypes;
  paymentThreshold?: number;
  flatUnit: string;
  houseNumber: string;
  street: string;
  suburb: string;
  state: ExistingRegions;
  postcode: string;
  primaryContact: string;
  accountLimit?: number;
}

export interface IBaseOrganisationsInfo {
  id: number,
  name: string,
}

interface OrganisationsState {
  organisationDetails: IFullOrganisation | null,
  baseOrganisationsInfo: IBaseOrganisationsInfo[],
  organisations: IOrganisation[],
  organisationServices: IOrganisationService[],
  isLoading: boolean
}

const InitialState: OrganisationsState = {
  organisationDetails: null,
  baseOrganisationsInfo: [],
  organisations: [],
  organisationServices: [],
  isLoading: false,
};

export class OrganisationsReducer extends ImmerReducer<OrganisationsState> {
  public setBaseOrganisationsInfo(value: IBaseOrganisationsInfo[]) {
    this.draftState.baseOrganisationsInfo = value;
  }

  public setOrganisations(value: IOrganisation[]) {
    this.draftState.organisations = value;
  }

  public setOrganisationDetails(value: IFullOrganisation | null) {
    this.draftState.organisationDetails = value;
  }

  public setOrganisationServices(value: IOrganisationService[]) {
    this.draftState.organisationServices = value;
  }

  public setIsLoading(value: boolean) {
    this.draftState.isLoading = value;
  }
}

export default createReducerFunction(OrganisationsReducer, InitialState);
