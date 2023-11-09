import { createReducerFunction, ImmerReducer } from 'immer-reducer';

import { FullfilmentType, IOrganisationService } from '@/store/reducers/services';
import { IFileKey, OrderDetails, OrderStatusEnum } from '@/store/reducers/user';

import { ExistingRegions } from '@/utils/getRegionsData';

export enum FinalProduct {
  WA = 'WACTL',
  NSW = 'RT',
  QLD = 'DNRTIT',
  SA = 'SATITLE',
  VIC = 'LANDIGT',
}

export enum FinalProductIdentifiers {
  WA = 'HTBTRW',
  NSW = 'HTBTRN',
  QLD = 'HTBTRQ',
  SA = 'HTBTRS',
  VIC = 'HTBTRV',
}

export enum EPaginationIdentifiers {
  HTAS = 'HTASP',
  HTPPS = 'HTPPSP',
  HTONSS1 = 'HTONSSP',
}

export interface IGetPreSignedGetURL {
  orderId: string,
  links: string[],
}

export interface ICompleteFilesUpload {
  itemId: number
  fileKeys: IFileKey[],
  fileKeysToDelete?: string[],
}

export interface IAttachFileToOrder {
  document: File,
  orderId: string,
  itemId: number
}

export enum EOrderItemType {
  SEARCH = 'search',
  PURCHASE = 'purchase',
}

export interface PlaceOrderProduct {
  productId: string;
  input: {
    [k in string]: any
  };
  description?: string,
}

export interface PlaceOrderProductWithIdentifier extends PlaceOrderProduct {
  identifier: string;
}

export interface IVerifyTempData {
  identifier: string,
  description: string,
}

export interface IVerify {
  matter: string,
  region: string,
  identifier: string,
  input: any,
}

export interface IVerifyResponse {
  data: any,
  isError: boolean,
  path: string,
  status: number,
  userNotification: string,
}

export interface IVerifiedItem {
  id: string;
  identifier: string;
  description: string,
  pageIndex?: number;
  render: { [p in string]: string };
  inputs: { [p in string]: string };
  searchCriteria?: { [p in string]: string };
}

export interface PlaceOrder {
  matter: string;
  region: string;
  service: string
  description: string;
  products: PlaceOrderProduct[];
  baseUrl?: string;
}

export interface PlacedOrder {
  id: number,
  orderId: string,
  createdAt: string,
  updatedAt: string,
  matter: string,
  description: string,
  service: string,
  fulfilment: string,
  organisationId: number,
  userId: string,
  status: string,
  paymentStatus: string,
  totalPrice: string,
  products: PlaceOrderProduct[]
}

export interface IPlaceOrderResult {
  orderId: string,
  status: OrderStatusEnum,
  description: string,
}

export interface TextInput {
  label: string,
  placeholder: string,
  type: 'text' | 'textarea',
  descriptionPrefix?: string,
  infotip: string
  isRequired: boolean,
}

export interface DropdownInput {
  label: string,
  placeholder: string,
  type: 'dropdown',
  infotip: string,
  keys: string[],
  defaultSelected?:number,
  isRequired: boolean,
}

export interface CheckboxInput {
  label: string,
  type: 'checkbox',
  value: boolean,
}

export type CommonInputTypes = TextInput | DropdownInput | CheckboxInput;

export type MaskedInputTypes = {
  mask?: string,
  infotip?: string;
  data: CommonInputTypes[]
};

export type DifferentStructureInput = {
  [p in string]: MaskedInputTypes
};

export type InputTypes = MaskedInputTypes | DifferentStructureInput;

export interface Product {
  productId: string,
  searchType: string,
  inputs: InputTypes,
  region: ExistingRegions,
  supplier: string,
  label: string,
  fulfilmentType: 'auto' | 'manual',
  itemType: EOrderItemType,
}

export interface IInitialOrderData {
  productId?: string,
  matter?: string,
  region: string,
  identifier?: string,
  firstName?: string,
  surname?: string
  street?: string
  suburb?: string
  streetNumber?: string
  unitNumber?: string;
  lot?: string;
  level?: string;
  lotPlanNumber?: string;
  companyName?: string;
  planType?: string;
  planNumber?: string;
  parcelNumber?: string;
}

export interface IInitialStandardSearcheData {
  firstName?: string,
  surname?: string,
}

export interface IResetOrder {
  isModalVisible: boolean,
  regionToChange: number,
  serviceToChange?: number
  isGlobalSearch?: boolean,
  initialOrderData?: IInitialOrderData,
  initialStandardSearcheData?: IInitialStandardSearcheData,
  productToScroll?: string,
}

export interface IManualInput {
  key: string;
  value: string;
}

export interface IPaginationRequest {
  identifier: string;
  input: Object,
  matter: string;
  region: ExistingRegions;
}

export interface IPaginationItem {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type TPagination = {
  [k in string]: IPaginationItem;
} | {};

export interface IFoundedItems {
  id: string,
  description: string;
  identifier: string;
  verificationIdentifier?: string;
  price: string;
  render: { [p in string]: string };
  inlineError?: string,
  isChosen: boolean;
  isUnable?: boolean;
  productId: string;
  pageIndex?: number;
  type: FullfilmentType;
  searchDescription: string;
  inputs?: { [p in string]: string };
  manualInputs?: IManualInput[];
  searchCriteria?: Object;
  isVerified?: boolean; // for front
  searchedBy?: string; // for front
  isOnVerify?: boolean; // for front
  isDisabled?: boolean; // for front
}

export type TFoundedItems = {
  [k in string]: IFoundedItems[]
} | null;

export type TManualProducts = {
  [k in string]: IFoundedItems[] | []
} | {};

interface OrderState {
  selectedRegion: number,
  selectedService: number,
  selectedServiceName: string,
  matter: string,
  isMatterError: string,
  shouldShowMatterError: boolean,
  shouldScrollToMatter: boolean,
  productsPrice: number,
  order: OrderDetails | null,
  orderProducts: IFoundedItems[] | null,
  orderManuallyProducts: TManualProducts,
  products: IOrganisationService[] | null,
  services: IOrganisationService[] | null,
  verifyTempData: IVerifyTempData | null,
  currentService: IOrganisationService | null,
  searchError: string | null,
  verifiedItems: IVerifiedItem[] | null,
  foundedItems: TFoundedItems,
  pagination: TPagination,
  isResultsVisible: boolean,
  initialOrderData: IInitialOrderData | null,
  initialStandardSearcheData: IInitialStandardSearcheData | null,
  shouldClearManualItems: boolean,
  isOrderStarted: boolean,
  resetOrder: IResetOrder | null,
  placeOrderResults: IPlaceOrderResult[] | null,
  productToScroll: string | null,
  isVerifyResponsesStatus: boolean,
}

const InitialState: OrderState = {
  selectedRegion: 0,
  selectedService: 0,
  selectedServiceName: '',
  matter: '',
  isMatterError: '',
  shouldShowMatterError: false,
  shouldScrollToMatter: false,
  productsPrice: 0,
  order: null,
  orderProducts: null,
  orderManuallyProducts: {},
  products: null,
  services: null,
  searchError: null,
  verifyTempData: null,
  currentService: null,
  verifiedItems: null,
  foundedItems: null,
  pagination: {},
  isResultsVisible: false,
  initialOrderData: null,
  initialStandardSearcheData: null,
  shouldClearManualItems: false,
  isOrderStarted: false,
  resetOrder: null,
  placeOrderResults: null,
  productToScroll: null,
  isVerifyResponsesStatus: false,
};

export class OrderReducer extends ImmerReducer<OrderState> {
  public setSelectedRegion(value: number) {
    this.draftState.selectedRegion = value;
  }

  public setSelectedService(value: number) {
    this.draftState.selectedService = value;
  }

  public setSelectedServiceName(value: string) {
    this.draftState.selectedServiceName = value;
  }

  public setMatter(value: string) {
    this.draftState.matter = value;
  }

  public setIsMatterError(value: string) {
    this.draftState.isMatterError = value;

    if (value) {
      this.draftState.shouldScrollToMatter = true;
      this.draftState.shouldShowMatterError = true;
    }
  }

  public setShouldShowMatterError(value: boolean) {
    this.draftState.shouldShowMatterError = value;
  }

  public setShouldScrollToMatter(value: boolean) {
    this.draftState.shouldScrollToMatter = value;
  }

  public setProductsPrice(value: number) {
    this.draftState.productsPrice = value;
  }

  public setOrder(value: OrderDetails | null) {
    this.draftState.order = value;
  }

  public setProducts(value: IOrganisationService[] | null) {
    this.draftState.products = value;
  }

  public setServices(value: IOrganisationService[] | null) {
    this.draftState.services = value;
  }

  public setCurrentService(value: IOrganisationService | null) {
    this.draftState.currentService = value;
    this.draftState.searchError = null;
  }

  public setOrderProducts(value: IFoundedItems[] | null) {
    this.draftState.orderProducts = value;
  }

  public updateOrderProduct(value: IFoundedItems) {
    if (this.draftState.orderProducts) {
      const index = this.draftState.orderProducts.findIndex((el) => el.id === value.id);

      if (index !== -1) {
        this.draftState.orderProducts[index] = value;
        return;
      }
    }

    this.draftState.orderProducts = [value];
  }

  public setOrderManuallyProducts(value: TManualProducts) {
    this.draftState.orderManuallyProducts = value;
  }

  public setInitialOrderData(value: IInitialOrderData | null) {
    this.draftState.initialOrderData = value;
  }

  public setInitialStandardSearcheData(value: IInitialStandardSearcheData | null) {
    this.draftState.initialStandardSearcheData = value;
  }

  public setSearchError(value: string | null) {
    this.draftState.searchError = value;
  }

  public setVerifiedItems(value: any[] | null) {
    this.draftState.verifiedItems = value;
  }

  public setVerifyTempData(value: IVerifyTempData | null) {
    this.draftState.verifyTempData = value;
  }

  public setFoundedItems(value: TFoundedItems | null) {
    this.draftState.foundedItems = value;
  }

  public setPagination(value: TPagination) {
    this.draftState.pagination = value;
  }

  public setIsResultsVisible(value: boolean) {
    this.draftState.isResultsVisible = value;
  }

  public setShouldClearManualItems(value: boolean) {
    this.draftState.shouldClearManualItems = value;
  }

  public setIsOrderStarted(value: boolean) {
    this.draftState.isOrderStarted = value;
  }

  public setResetOrder(value: IResetOrder | null) {
    this.draftState.resetOrder = value;
  }

  public setPlaceOrderResults(value: IPlaceOrderResult[] | null) {
    this.draftState.placeOrderResults = value;
  }

  public setProductToScroll(value: string | null) {
    this.draftState.productToScroll = value;
  }

  public changeRegion() {
    if (this.draftState.isOrderStarted) {
      this.draftState.matter = '';
    }
    this.draftState.order = null;
    this.draftState.foundedItems = null;
    this.draftState.orderProducts = null;
    this.draftState.productsPrice = 0;
    this.draftState.isMatterError = '';
    this.draftState.searchError = null;
    this.draftState.shouldScrollToMatter = false;
    this.draftState.initialOrderData = null;
    this.draftState.shouldClearManualItems = true;
    this.draftState.isOrderStarted = false;
    this.draftState.pagination = {};

    const defaultManualProducts = { ...this.draftState.orderManuallyProducts };

    for (const key in defaultManualProducts) defaultManualProducts[key] = [];

    this.draftState.orderManuallyProducts = defaultManualProducts;
  }

  public cleanCurrentOrder() {
    const cleanOrderManuallyProducts = Object.fromEntries(Object
      .entries(this.draftState.orderManuallyProducts)
      .map((item) => ([item[0], []])));

    this.draftState = {
      ...InitialState,
      orderManuallyProducts: cleanOrderManuallyProducts,
      services: this.draftState.services,
      products: this.draftState.products,
    };
  }

  public setVerifyResponsesStatus(value: boolean) {
    this.draftState.isVerifyResponsesStatus = value;
  }
}

export default createReducerFunction(OrderReducer, InitialState);
