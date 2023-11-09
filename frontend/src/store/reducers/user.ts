import { createReducerFunction, ImmerReducer } from 'immer-reducer';

import { PreferenceTabs } from '@/components/Settings/Preferences/Preferences';

import { IPinedServices } from '@/pages/AllServices';

import { EOrderItemType } from '@/store/reducers/order';
import { IFullOrganisation } from '@/store/reducers/organisations';

import { ExistingRegions } from '@/utils/getRegionsData';

export enum Roles {
  SYSTEM_ADMIN = 'system_admin',
  CUSTOMER_ADMIN = 'admin',
  CUSTOMER = 'user',
}

export enum PopupTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export enum OrderStatusEnum {
  OPEN = 'open',
  COMPLETE = 'complete',
  ERROR = 'error',
  IN_PROGRESS = 'in progress',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  LIST = 'list',
}

export interface ISendToEmailBody {
  orderId: string,
  fileKeys: IFileKey[],
  itemId: number,
  baseUrl?: string
}

export interface ISendAllToEmailBody {
  orderId: string,
  baseUrl?: string
}

export interface IUpdatePasswordBody {
  otp: string,
  username: string,
  newPassword: string
}

export interface IChangePasswordBody {
  oldPassword: string
  newPassword: string
}

export interface IUpdateUserBody {
  firstName: string
  lastName: string
  phone: string
  email?: string,
  state?: ExistingRegions
  password?: string,
  role?: string
}

export interface IUpdateOrderBody {
  status: OrderStatusEnum;
  orgId: number;
}

export interface IBackendOrdersWithQuery {
  data: BackendOrder[];
  count: number;
}

export interface IPopupMessage {
  type: PopupTypes,
  mainText: string,
  additionalText: string,
  applyTimeout?: boolean,
}

export interface IChangeUserInOrganisationBody {
  usersIds: number[],
  status: boolean,
}

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  username: string,
  phone: string,
  state: ExistingRegions,
  email: string,
  role: Roles,
  pinnedServices: IPinedServices | null,
  userSettings: ISettings,
  organisations: IFullOrganisation[]
}

export interface Order {
  id: string,
  matter: string,
  service: string,
  description: string,
  status: OrderStatusEnum,
  orderItems: {
    id: number,
    itemType: EOrderItemType,
    fileKeys: IFileKey[],
    identifier: string,
  }[],
  organisation: {
    id: number,
    name: string,
  },
  user: {
    id: number,
    firstName: string,
    lastName: string,
  },
  date: number
}

export interface BackendOrder extends Omit<Order, 'orderItems'> {
  orderItems: BackendOrderItems
}

export interface Product {
  'collection': string
  'productCode': string,
  'supplier': string,
  'region': string,
  'description': string,
  'searchType': string,
  'priceExGST': string,
  'GST': string,
  'priceInclGST': string,
  'fulfilmentType': 'auto' | 'manual',
  'isInput1Required': boolean,
  'isInput2Required': boolean
}

export interface IPriceListCsv {
  Collection: string,
  Supplier: string,
  'Search Type': string,
  Description: string,
  'Product Code': string,
  'Price ex GST': string,
  GST: string,
  'Price incl GST': string
}

export interface PriceListDetail {
  id: number,
  priceListName: string,
  priceList: Product[]
}

export interface IFullPriceListDetail extends PriceListDetail {
  description: string
  effectiveFromDate: string
  isActive: boolean
  effectiveToDate?: string
  priceListId: number
}

export interface OrderItems {
  id: number,
  fulfilmentType: 'auto' | 'manual',
  itemType: EOrderItemType,
  fileKeys: IFileKey[],
  identifier: string,
  input: {
    [k in string]: any
  },
  meta: any,
  nextCall: string,
  orderId: string
  path: string,
  price: string,
  productId: string,
  productName: string,
  region: ExistingRegions,
  retryCount: number,
  service: string,
  status: string,
}

export interface OrderDetails {
  id: string,
  matter: string,
  service: string,
  description: string,
  totalPrice: string,
  createdAt: string,
  updatedAt: string,
  status: string,
  statusDescription: string,
  userName: string,
  orgId: number,
  organisation: string,
  exGST: string,
  GST: string,
  orderItems: OrderItems[]
}

export interface IFileKey {
  s3Key: string,
  filename: string,
}

export interface IDownloadDocumentsItem {
  orderId: string,
  fileKeys: IFileKey[],
}

interface BackendOrderItems extends Omit<OrderItems, 'link'> {
  fileKeys: IFileKey[],
}

export interface BackendOrderDetails extends Omit<OrderDetails, 'orderItems'> {
  orderItems: BackendOrderItems
}

export interface OrganizationUser {
  id: number,
  name: string,
  email: string,
  isEmailVerified: boolean,
  role: string
}

export interface ICreatedUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  organisationId: number;
  role: Roles.CUSTOMER | Roles.CUSTOMER_ADMIN;
  baseUrl?: string;
  state: string;
}

export enum EmailPreference {
  AlwaysEmailCompletedOrders = 'isAlwaysEmailCompletedOrders',
  // AlwaysSendAttachmentsAsPDF = 'isAlwaysSendAttachmentsAsPDF',
  // MergeAttachmentsIntoSinglePDF = 'isMergeAttachmentsIntoSinglePDF',
  // OnlySendComprehensiveSummaryAttachment = 'isOnlySendComprehensiveSummaryAttachment',
  // SendSettlementOrders = 'isSendSettlementOrders',
  // SendOrderCommentUpdates = 'isSendOrderCommentUpdates',
  // SendManualOrders = 'isSendManualOrders',
  // AlwaysSendAttachmentsAsPDFVICTitleSearch = 'isAlwaysSendAttachmentsAsPDFVICTitleSearch',
  // AlwaysSendAttachmentsAsPDFVICCertificate = 'isAlwaysSendAttachmentsAsPDFVICCertificate',
  // GroupOrdersIntoSingleEmailVICPackageOrder = 'isGroupOrdersIntoSingleEmailVICPackageOrder',
  // GroupOrdersIntoSingleEmailVICPropertyLookup = 'isGroupOrdersIntoSingleEmailVICPropertyLookup',
  // GroupOrdersIntoSingleEmailVICPropertyEnquiry = 'isGroupOrdersIntoSingleEmailVICPropertyEnquiry',
  // GroupOrdersIntoSingleEmailPPSROrganisationGrantorSearch = 'isGroupOrdersIntoSingleEmailPPSROrganisationGrantorSearch',
  // GroupOrdersIntoSingleEmailPPSRIndividualGrantorSearch = 'isGroupOrdersIntoSingleEmailPPSRIndividualGrantorSearch',
}

export enum GeneralPreference {
  ShowOwnOrders = 'isShowOwnOrders',
}

export interface ISettings {
  [PreferenceTabs.Email]: {
    [key in EmailPreference]: boolean
  }
  [PreferenceTabs.General]: {
    [key in GeneralPreference]: boolean
  }
}

export interface IUserSettings extends ISettings {
  pinnedServices: IPinedServices | null,
  isOrganisationSettings?: boolean,
}

export interface IMatterAws {
  matter: string,
  description: string,
  ordersAmount: number,
  pendingOrdersAmount: number,
  lastOrdered: string,
  orgName: string,
  orgId: number,
}
export interface IMattersAws {
  data: IMatterAws[],
  count: number
}

export interface IMatterOrder {
  id: number;
  orderId: string;
  service: string;
  description : string;
  status : OrderStatusEnum;
  user: {
    userId: number,
    name: string,
    profilePicture: string,
  }
  date: string,
}

interface UserState {
  user: User | null,
  orgUsers: OrganizationUser[] | null,
  isLoadingUser: boolean,
  orders: Order[],
  ordersTotal: number | null,
  matters: IMatterAws[],
  mattersTotal: number | null,
  mattersLoadState: boolean,
  matterOrders: IMatterOrder[] | null,
  matterOrdersTotal: number | null,
  matterOrdersLoadState: boolean,
  orderDetails: OrderDetails | null,
  matterDetails: OrderDetails[] | null,
  priceList: PriceListDetail | null,
  selectedMatter: string | null,
  popup: IPopupMessage | null,
  settings: ISettings | null,
  pinnedServices: IPinedServices | null,
  visitedMatterFrom: string | null,
  visitedOrderDetailsFrom: string | null,
  visitedListResultFrom: string | null,
}

const InitialState: UserState = {
  user: null,
  orgUsers: null,
  isLoadingUser: false,
  orders: [],
  ordersTotal: null,
  matters: [],
  mattersTotal: null,
  mattersLoadState: false,
  matterOrders: null,
  matterOrdersTotal: null,
  matterOrdersLoadState: false,
  orderDetails: null,
  matterDetails: null,
  priceList: null,
  selectedMatter: null,
  popup: null,
  settings: null,
  pinnedServices: null,
  visitedMatterFrom: null,
  visitedOrderDetailsFrom: null,
  visitedListResultFrom: null,
};

export class UserReducer extends ImmerReducer<UserState> {
  public setUser(value: User | null) {
    this.draftState.user = value;
  }

  public setSettings(settings: ISettings) {
    this.draftState.settings = settings;
  }

  public setPinedService(pinnedServices: IPinedServices) {
    this.draftState.pinnedServices = pinnedServices;
  }

  public setIsLoadingUser(value: boolean) {
    this.draftState.isLoadingUser = value;
  }

  public setPriceList(value: PriceListDetail | null) {
    this.draftState.priceList = value;
  }

  public setOrders(value: Order[]) {
    this.draftState.orders = value;
  }

  public setOrdersTotal(value: number | null) {
    this.draftState.ordersTotal = value;
  }

  public setMatters(value: IMatterAws[]) {
    this.draftState.matters = value;
  }

  public setMattersTotal(value: number | null) {
    this.draftState.mattersTotal = value;
  }

  public setMattersLoadState(value: boolean) {
    this.draftState.mattersLoadState = value;
  }

  public setMatterOrders(value: IMatterOrder[] | null) {
    this.draftState.matterOrders = value;
  }

  public setMatterOrdersTotal(value: number | null) {
    this.draftState.matterOrdersTotal = value;
  }

  public setMatterOrdersLoadState(value: boolean) {
    this.draftState.matterOrdersLoadState = value;
  }

  public setOrderDetails(value: OrderDetails | null) {
    this.draftState.orderDetails = value;
  }

  public setMatterDetails(value: OrderDetails[] | null) {
    this.draftState.matterDetails = value;
  }

  public setOrgUsers(value: OrganizationUser[] | null) {
    this.draftState.orgUsers = value;
  }

  public setSelectedMatter(value: string | null) {
    this.draftState.selectedMatter = value;
  }

  public setPopup(value: IPopupMessage | null) {
    this.draftState.popup = value;
  }

  public setVisitedMatterFrom(value: string | null) {
    this.draftState.visitedMatterFrom = value;
  }

  public setVisitedOrderDetailsFrom(value: string | null) {
    this.draftState.visitedOrderDetailsFrom = value;
  }

  public setVisitedListResultFrom(value: string | null) {
    this.draftState.visitedListResultFrom = value;
  }

  public logout() {
    this.draftState.user = null;
  }
}

export default createReducerFunction(UserReducer, InitialState);
