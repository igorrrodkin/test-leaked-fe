import { HttpClientProtected } from '@/api/httpClientProtected';

import { IApiKey } from '@/store/reducers/apiKey';
import {
  IAllSummary, IInvoice, INewInvoiceDetails, IPaymentCredits, ISummary,
} from '@/store/reducers/billing';
import { IFullLog, ILog } from '@/store/reducers/logs';
import { ICreateNotice, INotice } from '@/store/reducers/notices';
import {
  IAttachFileToOrder,
  ICompleteFilesUpload, IGetPreSignedGetURL,
  IPaginationRequest,
  IPlaceOrderResult,
  IVerify,
  IVerifyResponse,
  PlacedOrder,
  PlaceOrder,
} from '@/store/reducers/order';
import {
  IBaseOrganisationsInfo,
  ICreateOrganisation, IEditOrganisation, IFullOrganisation, IOrganisation, IUpdateOrganisationRequest,
} from '@/store/reducers/organisations';
import { IAssignPriceList, IPriceList, IUploadPriceList } from '@/store/reducers/priceList';
import { IReport } from '@/store/reducers/reports';
import {
  IChangeServiceStatus,
  ICreateService, IOrganisationService, IService, IServiceUpdated, IUpdateServiceInOrganisation,
} from '@/store/reducers/services';
import {
  BackendOrderDetails,
  IBackendOrdersWithQuery,
  IChangeUserInOrganisationBody,
  ICreatedUser,
  IFullPriceListDetail, IMattersAws, ISendAllToEmailBody,
  ISendToEmailBody, ISettings, IUpdateOrderBody,
  IUpdateUserBody,
  IUserSettings, PriceListDetail,
  User,
} from '@/store/reducers/user';
import { IOrganisationUser } from '@/store/reducers/users';

export class MainApiProtected extends HttpClientProtected {
  private static instanceCached: MainApiProtected;

  public static getInstance() {
    if (!MainApiProtected.instanceCached) {
      MainApiProtected.instanceCached = new MainApiProtected();

      return MainApiProtected.instanceCached;
    }

    return MainApiProtected.instanceCached;
  }

  public updateUser = (userId: number, body: IUpdateUserBody) => (
    this.instance.patch(`/users/${userId}`, body)
  );

  public updateUserByAdmin = (userId: number, body: IUpdateUserBody) => (
    this.instance.patch(`users/edit-by-admin/${userId}`, body)
  );

  public createUser = (body: ICreatedUser) => (
    this.instance.post('users/add-user', body)
  );

  public getMe = () => this.instance.get<User>('/users/profile');

  public getPriceLists = () => this.instance.get<IPriceList[]>('/price-lists');

  public getPriceListsByOrganisation = (organisationId: number) => this.instance.get<IFullPriceListDetail[]>(`organisations/price-lists/${organisationId}`);

  public getPriceList = (orgId: number) => this.instance.get<PriceListDetail>(`/organisations/price-list/${orgId}`);

  public getPriceListById = (id: number) => this.instance.get<PriceListDetail>(`/price-lists/${id}`);

  public placeOrder = (order: PlaceOrder) => (
    this.instance.post<PlacedOrder>('/orders', order)
  );

  public purchaseOrder = (order: PlaceOrder[]) => (
    this.instance.post<PlacedOrder, { ordersStatuses: IPlaceOrderResult[] }>('/orders/purchase', order)
  );

  public verify = (body: IVerify) => (
    this.instance.post<IVerifyResponse>('/orders/first-verification', body)
  );

  public orderPagination = (body: IPaginationRequest) => (
    this.instance.post<any>('/orders/pagination', body)
  );

  public getOrderDetails = (id: string) => (
    this.instance.get<BackendOrderDetails>(`/orders/${id}`)
  );

  public getMatterDetails = (id: string, organisationId: number) => (
    this.instance.get<BackendOrderDetails[]>(`/orders/matter?matterReference=${id}&organisationId=${organisationId}`)
  );

  public addCardInitCustomer = (organisationId: number) => (
    this.instance.post(`payments/init-customer/${organisationId}`)
  );

  public attachPaymentMethodToCustomer = (paymentMethodId: string, organisationId: number) => (
    this.instance.patch(`payments/payment-method/attach/${paymentMethodId}/${organisationId}`)
  );

  public removeCard = (id: string, organisationId: number) => (
    this.instance.delete(`payments/payment-method/${id}/${organisationId}`)
  );

  public setAsPrimaryCard = (customerId: string, methodId: string) => (
    this.instance.put(`payments/payment-method/default/${customerId}/${methodId}`)
  );

  public updateOderStatus = (orderId: string, body: IUpdateOrderBody) => (
    this.instance.patch(`/super-admin/order/${orderId}`, body)
  );

  public getBaseOrganisationsInfo = () => (
    this.instance.get<IBaseOrganisationsInfo[]>('/organisations/base-info')
  );

  public getOrganisations = () => (
    this.instance.get<IOrganisation[]>('/organisations')
  );

  public getOrganisationServices = (organisationId: number) => (
    this.instance.get<IOrganisationService[]>(`/organisations/services/${organisationId}`)
  );

  public editOrganisation = (body: IEditOrganisation) => (
    this.instance.patch('/organisations/status/bulk', body)
  );

  public createOrganisation = (body: ICreateOrganisation) => (
    this.instance.post<IOrganisation>('/organisations', body)
  );

  public getOrganisation = (id: number) => (
    this.instance.get<IFullOrganisation>(`/organisations/${id}`)
  );

  public assignPriceListToOrganisation = (body: IAssignPriceList[]) => (
    this.instance.patch<IOrganisation>('/organisations/price-list/bulk', body)
  );

  public getNotices = () => (
    this.instance.get<INotice[]>('/notice')
  );

  public createNotice = (body: ICreateNotice) => (
    this.instance.post<INotice>('/notice', body)
  );

  public updateNotice = (id: number, body: ICreateNotice) => (
    this.instance.patch<INotice>(`/notice/${id}`, body)
  );

  public getActiveNotices = () => this.instance.get<INotice[]>('/notice/active');

  public deleteNotice = (id: number) => (
    this.instance.delete<INotice>(`/notice/${id}`)
  );

  public getSysAdminUser = () => (
    this.instance.get<IOrganisationUser[]>('/users')
  );

  public getUsersForPreferences = (organisationId: number) => (
    this.instance.get<IOrganisationUser[]>(`/users/by-org/table/${organisationId}`)
  );

  public setUserSettings = (userId: number, body: IUserSettings) => (
    this.instance.post(`/users/settings/${userId}`, body)
  );

  public getOrganisationDefaultSettings = () => (
    this.instance.get<ISettings>('/organisations/settings/default')
  );

  public getUser = (userId: number) => (
    this.instance.get(`/users/by-id/${userId}`)
  );

  public getServices = () => (
    this.instance.get<IService[]>('/products')
  );

  public getUserServices = () => (
    this.instance.get<IService[]>('/products')
  );

  public updateService = (productId: string, body: IServiceUpdated) => (
    this.instance.patch(`/products/${productId}`, body)
  );

  public updateServicesStatus = (body: IChangeServiceStatus) => (
    this.instance.patch('/products/status', body)
  );

  public createService = (body: ICreateService) => (
    this.instance.post('/products', body)
  );

  public deleteService = (productId: number) => (
    this.instance.delete(`/products/${productId}`)
  );

  public getReports = (query?: string) => (
    this.instance.get<IReport[]>(`/super-admin/reporting${query}`)
  );

  public changeUserStatusInOrganisation = (
    body: IChangeUserInOrganisationBody,
  ) => (
    this.instance.patch<IService[]>('/organisations/user-to-organisation/bulk', body)
  );

  public changeServiceStatusInOrganisation = (
    body: IUpdateServiceInOrganisation[],
  ) => (
    this.instance.post('/products/to-organisation/bulk', body)
  );

  public deleteUserByOrganisation = (userId: number, organisationId: number) => (
    this.instance.delete<IService[]>(`/organisations/delete-user/${userId}/${organisationId}`)
  );

  public updateOrganisation = (organisationId: number, body: IUpdateOrganisationRequest) => (
    this.instance.patch(`/organisations/${organisationId}`, body)
  );

  public getOrdersWithQuery = (query?: string) => (
    this.instance.get<IBackendOrdersWithQuery>(`/orders/query${query ? `?${query}` : ''}`)
  );

  public getMattersWithQuery = (query?: string) => (
    this.instance.get<IMattersAws>(`/orders/aws/matter${query ? `?${query}` : ''}`)
  );

  public sendFilesToEmail = (body: ISendToEmailBody[]) => (
    this.instance.post('/orders/send-documents', body)
  );

  public sendAllFilesToEmail = (body: ISendAllToEmailBody[]) => (
    this.instance.post('/orders/send-documents-by-order', body)
  );

  public uploadPriceList = (body: IUploadPriceList) => (
    this.instance.post('/price-lists', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  public setDefaultPriceList = (id: number) => (
    this.instance.patch(`/price-lists/${id}`)
  );

  public attachFileToOrder = (body: IAttachFileToOrder) => (
    this.instance.post('/super-admin/order-item/complete', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  public getPresignedPost = (fileKey: string) => (
    this.instance.get(`/super-admin/get-presighn-url/${fileKey}`)
  );

  public getPreSignedGet = (body: IGetPreSignedGetURL[]) => (
    this.instance.post<{ orderId: string, links: string[] }[]>('/super-admin/get-signed-url/bulk', body)
  );

  public completeFilesUpload = (body: ICompleteFilesUpload) => (
    this.instance.patch('/super-admin/order-item/complete', body)
  );

  public getApiKeys = (query: string) => (
    this.instance.get<any[]>(`/super-admin/api-key?${query}`)
  );

  public generateApiKey = (orgId: number) => (
    this.instance.post<IApiKey>('/super-admin/api-key', { orgId })
  );

  public revokeApiKey = (id: number) => (
    this.instance.delete(`/super-admin/api-key/${id}`)
  );

  // Payments

  public getSummary = (orgId?: number) => (
    this.instance.get<ISummary>(`/payments/billing/summary${orgId ? `?orgId=${orgId}` : ''}`)
  );

  public getAllSummary = () => (
    this.instance.get<IAllSummary[]>('/payments/billing/summary')
  );

  public getInvoices = (orgId?: number) => (
    this.instance.get<IInvoice[]>(`/payments/billing/invoices${orgId ? `?orgId=${orgId}` : ''}`)
  );

  public getPaymentCredits = (orgId?: number) => (
    this.instance.get<IPaymentCredits[]>(`/payments/billing/payments-credits${orgId ? `?orgId=${orgId}` : ''}`)
  );

  public payNow = (invoiceNumber: string, orgId: number) => (
    this.instance.post(`/payments/invoices/pay/${invoiceNumber}/${orgId}`)
  );

  public getInvoiceDetails = (invoiceNumber: string) => (
    this.instance.get<INewInvoiceDetails>(`/payments/invoice/${invoiceNumber}`)
  );

  public getPaymentBalance = (orgId: number) => (
    this.instance.get<{
      balance: number; credit: number; openBalance: number; pendingPaymentsTotal: number;
    }>(`/payments/balances/${orgId}`)
  );

  public merchantPayment = (body: { amount: number, paymentMethodId: string }) => (
    this.instance.post('/payments/merchant', body)
  );

  public manualPayment = (body: {
    orgId: number,
    totalAmount: number,
    paymentType: string,
    description: string,
    allocations?: { invoiceId: number, manualAllocation: number }[],
  }) => (
    this.instance.post('/payments/manual', body)
  );

  public manualAllocate = (body: {
    creditId: number,
    allocations?: { invoiceId: number, manualAllocation: number }[],
  }) => (
    this.instance.post('/payments/allocate', body)
  );

  public withdraw = (body: { withdrawAmount: number, orgId: number, paymentType: string, description: string, }) => (
    this.instance.post('/payments/withdraw', body)
  );

  public logout = () => (
    this.instance.get('/login/logout')
  );

  // Logs

  public getLogs = (query?: string) => this.instance.get<{ result: ILog[] | null, totalCount: number }>(`/logs${query ? `?${query}` : ''}`);

  public getFullLog = (id: string) => this.instance.get<[IFullLog]>(`/logs/full-info/${id}`);

  // Document

  public deleteDocument = (query: string) => this.instance.delete(`/documents-store?s3Key=${query}`);
}
