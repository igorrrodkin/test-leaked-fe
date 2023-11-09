import axios from 'axios';
import { createActionCreators } from 'immer-reducer';

import { IFileData, LoadStates } from '@/components/Dashboard/ManuallyFulfillment';

import { AsyncAction } from '@/store/actions/common';
import { userActions } from '@/store/actions/userActions';

import {
  EOrderItemType,
  FinalProduct,
  FinalProductIdentifiers,
  ICompleteFilesUpload, IGetPreSignedGetURL,
  IPaginationRequest,
  IVerify,
  OrderReducer,
  PlaceOrder,
  PlaceOrderProduct,
  PlaceOrderProductWithIdentifier,
} from '@/store/reducers/order';
import { FullfilmentType } from '@/store/reducers/services';
import {
  IDownloadDocumentsItem,
  IFileKey, ISendAllToEmailBody,
  ISendToEmailBody,
  IUpdateOrderBody,
  OrderDetails,
  PopupTypes,
} from '@/store/reducers/user';

import downloadFile from '@/utils/downloadFile';
import getNounByForm from '@/utils/getNounByForm';
import getRegionsData, { doubleVerificationProducts } from '@/utils/getRegionsData';
import LocalStorage from '@/utils/localStorage';
import mapTitlesByService from '@/utils/mapTitlesByService';
import mapVerifiedData from '@/utils/mapVerifiedData';
import { validateMatter } from '@/utils/servicesValidation';

export const orderActions = createActionCreators(OrderReducer);

export type OrderActions = ReturnType<typeof orderActions.setProducts>
| ReturnType<typeof orderActions.setServices>
| ReturnType<typeof orderActions.setSelectedRegion>
| ReturnType<typeof orderActions.setSelectedService>
| ReturnType<typeof orderActions.setSelectedServiceName>
| ReturnType<typeof orderActions.setInitialOrderData>
| ReturnType<typeof orderActions.setInitialStandardSearcheData>
| ReturnType<typeof orderActions.setCurrentService>
| ReturnType<typeof orderActions.setProductsPrice>
| ReturnType<typeof orderActions.setMatter>
| ReturnType<typeof orderActions.setIsMatterError>
| ReturnType<typeof orderActions.setShouldShowMatterError>
| ReturnType<typeof orderActions.setShouldScrollToMatter>
| ReturnType<typeof orderActions.setOrder>
| ReturnType<typeof orderActions.setOrderProducts>
| ReturnType<typeof orderActions.updateOrderProduct>
| ReturnType<typeof orderActions.setOrderManuallyProducts>
| ReturnType<typeof orderActions.setSearchError>
| ReturnType<typeof orderActions.setVerifyTempData>
| ReturnType<typeof orderActions.setVerifiedItems>
| ReturnType<typeof orderActions.setFoundedItems>
| ReturnType<typeof orderActions.setPagination>
| ReturnType<typeof orderActions.setIsResultsVisible>
| ReturnType<typeof orderActions.setShouldClearManualItems>
| ReturnType<typeof orderActions.setIsOrderStarted>
| ReturnType<typeof orderActions.changeRegion>
| ReturnType<typeof orderActions.setResetOrder>
| ReturnType<typeof orderActions.setPlaceOrderResults>
| ReturnType<typeof orderActions.setProductToScroll>
| ReturnType<typeof orderActions.cleanCurrentOrder>
| ReturnType<typeof orderActions.setVerifyResponsesStatus>;

export const verifyAction = (
  body: IVerify,
  pageIndex = 0,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const { matter, pagination } = getState().order;

    dispatch(userActions.setPopup(null));
    dispatch(orderActions.setSearchError(null));
    dispatch(orderActions.setIsOrderStarted(true));

    const isMatterError = validateMatter(matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return;
    }

    const response = await mainApiProtected.verify(body);

    if (response.userNotification) {
      dispatch(orderActions.setSearchError(response.userNotification));

      return;
    }

    if (response.data && response.data.totalCount) {
      dispatch(orderActions.setPagination({
        ...pagination,
        [body.identifier]: {
          pageIndex: response.data.pageIndex,
          pageSize: response.data.pageSize,
          totalCount: response.data.totalCount,
          totalPages: response.data.totalPages,
        },
      }));
    }

    const mappedResponse = mapVerifiedData(
      response.data,
      body.region,
      body.identifier,
      {
        matter: matter.trim(),
        searchCriteria: body.input,
      },
      pageIndex,
    );

    dispatch(orderActions.setVerifiedItems(mappedResponse));
  } catch (error: any) {
    console.error(error);

    if (error.statusCode === 'ERR_NETWORK') {
      dispatch(orderActions.setSearchError('Data provider is unavailable. Please, try again later.'));

      return Promise.reject();
    }

    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(orderActions.setSearchError(errorMessage));

    return Promise.reject();
  }
};

export const getPaginatedDataAction = (
  body: IPaginationRequest,
  price: string,
  description: string,
  pageIndex: number,
  isVerification: boolean = false,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const {
      currentService,
      foundedItems,
      verifiedItems,
      verifyTempData,
    } = getState().order;

    dispatch(userActions.setPopup(null));

    const isMatterError = validateMatter(body.matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return;
    }

    const response = await mainApiProtected.orderPagination(body);

    if (isVerification) {
      dispatch(orderActions.setVerifiedItems([
        ...(verifiedItems || []),
        ...mapVerifiedData(
          response.data,
          body.region,
          verifyTempData!.identifier,
          { matter: body.matter.trim() },
          pageIndex,
        ),
      ]));
    } else if (foundedItems && currentService && currentService.identifier) {
      const meta = response.data;
      const { region } = body;

      const orderItem = {
        meta: {
          data: meta,
        },
        region,
      };

      dispatch(orderActions.setFoundedItems({
        ...foundedItems,
        [currentService.identifier]: [
          ...foundedItems[currentService.identifier],
          ...mapTitlesByService(
            orderItem,
            price,
            currentService.identifier,
            description,
            {
              pageIndex,
            },
          ),
        ],
      }));
    }
  } catch (error: any) {
    console.error(error);

    if (error.statusCode === 'ERR_NETWORK') {
      dispatch(userActions.setPopup({
        type: PopupTypes.ERROR,
        mainText: 'Error',
        additionalText: 'Data provider is unavailable. Please, try again later.',
        applyTimeout: false,
      }));

      return Promise.reject();
    }

    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));

    return Promise.reject();
  }
};

export const initializeOrderAction = (
  region: string,
  service: string,
  orderItem: PlaceOrderProductWithIdentifier,
  generatedDescription: string = '',
  clearVerifiedItems?: Function,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  dispatch(userActions.setPopup(null));
  dispatch(orderActions.setSearchError(null));

  const {
    matter,
    products,
    services,
    foundedItems,
    pagination,
    verifiedItems,
  } = getState().order;

  try {
    const isMatterError = validateMatter(matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return;
    }

    dispatch(orderActions.setIsOrderStarted(true));

    const description = generatedDescription || Object.entries(orderItem.input).reduce((acc, [key, value]) => {
      if (key !== 'matterReference') {
        acc.push(value);
      }
      return acc;
    }, [] as string[]).join(' ');

    const order: PlaceOrder = {
      matter: matter.trim(),
      region,
      service,
      products: [orderItem],
      description,
      ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
    };

    const { orderId } = await mainApiProtected.placeOrder(order);
    const currentOrder = await mainApiProtected.getOrderDetails(orderId);
    const currentOrderItems = currentOrder.orderItems[0];
    const { meta } = currentOrderItems;

    if (meta.userNotification) {
      if (doubleVerificationProducts.includes(currentOrder.orderItems[0].productId)) {
        dispatch(userActions.setPopup({
          type: PopupTypes.ERROR,
          mainText: 'Error',
          additionalText: meta.userNotification,
          applyTimeout: false,
        }));
      } else {
        dispatch(orderActions.setSearchError(meta.userNotification));
      }

      return await Promise.reject();
    }

    dispatch(orderActions.setOrder(currentOrder as unknown as OrderDetails));

    if (clearVerifiedItems) clearVerifiedItems();

    let p = products!.find((el) => el.productId === FinalProduct[region]);
    if (!p) p = services!.find((el) => el.productId === FinalProduct[region]);

    const updatedFoundedItems = {
      ...foundedItems,
    };
    updatedFoundedItems[orderItem.identifier] = mapTitlesByService(
      {
        meta,
        region: currentOrderItems.region,
      },
      p ? p.priceInclGST : '0',
      orderItem.identifier,
      description,
      {
        pageIndex: 0,
        searchCriteria: orderItem.input,
      },
    );

    if (meta.data.totalCount) {
      dispatch(orderActions.setPagination({
        ...pagination,
        [orderItem.identifier]: {
          pageSize: meta.data.pageSize,
          pageIndex: meta.data.pageIndex - 1,
          totalCount: meta.data.totalCount,
          totalPages: meta.data.totalPages,
        },
      }));
    }

    dispatch(orderActions.setFoundedItems(updatedFoundedItems));
    dispatch(orderActions.setIsResultsVisible(true));
  } catch (error: any) {
    console.error(error);

    if (error.statusCode === 'ERR_NETWORK') {
      if (verifiedItems?.length) {
        dispatch(userActions.setPopup({
          type: PopupTypes.ERROR,
          mainText: 'Error',
          additionalText: 'Data provider is unavailable. Please, try again later.',
          applyTimeout: false,
        }));
      } else {
        dispatch(orderActions.setSearchError('Data provider is unavailable. Please, try again later.'));
      }

      return Promise.reject();
    }

    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    if (verifiedItems?.length) {
      dispatch(userActions.setPopup({
        mainText: 'Error',
        additionalText: errorMessage,
        type: PopupTypes.ERROR,
      }));
    } else {
      dispatch(orderActions.setSearchError(errorMessage));
    }

    return Promise.reject();
  }
};

export const placeOrderAction = (
  region: string,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    const {
      matter,
      orderProducts,
      orderManuallyProducts,
      products,
      services,
    } = getState().order;
    const { user } = getState().user;

    dispatch(userActions.setPopup(null));

    const isMatterError = validateMatter(matter);

    if (isMatterError) {
      dispatch(orderActions.setIsMatterError(isMatterError));
      return await Promise.reject();
    }

    if (!orderProducts) {
      if (Object.values(orderManuallyProducts).every((el) => !el.length)) {
        dispatch(userActions.setPopup({
          type: PopupTypes.ERROR,
          mainText: 'Error',
          additionalText: 'You must add at least 1 product to your order',
        }));
        return;
      }
    }

    const filteredProducts: (PlaceOrderProduct | PlaceOrderProductWithIdentifier)[] = [];

    if (orderProducts) {
      orderProducts.forEach((item) => {
        if (item.type === FullfilmentType.AUTO && item.isChosen) {
          const product: PlaceOrderProductWithIdentifier = {
            productId: FinalProduct[region],
            identifier: FinalProductIdentifiers[region],
            input: {
              matterReference: matter,
              ...item.inputs,
            },
          };

          filteredProducts.push(product);
        }
      });
    }

    if (orderManuallyProducts) {
      Object.entries(orderManuallyProducts).forEach(([key, value]) => {
        if (value.length) {
          value.forEach((el) => {
            if (el.isChosen) {
              const obj = {
                productId: key,
                description: el.description,
                ...(el.identifier === 'HTBTRS' ? { identifier: el.identifier } : {}),
                input: {
                  matterReference: matter,
                },
              };

              el.manualInputs!.forEach((inputEl) => {
                obj.input[inputEl.key] = inputEl.value;
              });

              filteredProducts.push(obj as PlaceOrderProduct);
            }
          });
        }
      });
    }

    const allRequests = filteredProducts.map((product) => {
      const temp = { ...product };
      let s = products?.find((el) => el.productId === temp.productId);

      if (!s) s = services?.find((el) => el.productId === temp.productId);

      const description = temp.description || Object.entries(temp.input).reduce((acc, [key, value]) => {
        if (key !== 'matterReference' && key !== 'reason') {
          acc.push(value);
        }
        return acc;
      }, [] as string[]).join(' ');

      delete temp.description;

      return {
        matter: matter.trim(),
        region,
        service: s ? `${s.region}: ${s.label}` : 'Unknown Service',
        products: [temp],
        organisationId: user!.organisations[0].id, /* TODO: change it after adding select organisation logic */
        description,
        ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
      };
    });

    const { ordersStatuses } = await mainApiProtected.purchaseOrder(allRequests);

    dispatch(orderActions.setPlaceOrderResults(ordersStatuses));

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success',
      additionalText: 'Your orders were successfully created',
    }));

    return await Promise.resolve();
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

export const sendDocumentsToEmailAction = (
  items: ISendToEmailBody[],
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const documentsAmount = items.reduce((acc, value) => acc + value.fileKeys.length, 0);

    await mainApiProtected.sendFilesToEmail(items);

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: `${getNounByForm(documentsAmount, 'Document')} have been sent`,
      additionalText: 'Please, check your email',
    }));
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

export const sendAllDocumentsToEmailAction = (
  items: ISendAllToEmailBody[],
  documentsAmount: number,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.sendAllFilesToEmail(items);

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: `${getNounByForm(documentsAmount, 'Document')} have been sent`,
      additionalText: 'Please, check your email',
    }));
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

export const downloadDocuments = (
  items: IDownloadDocumentsItem[],
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    if (items.length === 1 && items[0].fileKeys.length === 1) {
      const body: IGetPreSignedGetURL = {
        orderId: items[0].orderId,
        links: items[0].fileKeys.map((el) => el.s3Key),
      };

      const preSignedUrl = await mainApiProtected.getPreSignedGet([body]);

      downloadFile(preSignedUrl[0].links[0], 'Documents.pdf');
      return;
    }

    const token = LocalStorage.getAccessToken();

    const data = await axios.post(
      `${process.env.URL_API}/orders/items-archive`,
      { fileKeys: items.flatMap(({ fileKeys }) => fileKeys) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      },
    );
    const blob = new Blob([data.data], { type: 'application/zip' });

    downloadFile(URL.createObjectURL(blob), 'Documents.zip');
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

export const uploadFileAction = (
  updateFileData: (
    file: IFileData,
    state: LoadStates,
    data?: IFileKey,
  ) => void,
  fileData: IFileData,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected, S3Api },
) => {
  try {
    const uploadFileToS3Action = async ({ name }: File): Promise<IFileKey> => {
      const dotIndex = name.lastIndexOf('.');
      const fileExtension = name.substring(dotIndex + 1);
      const fileNameWithoutExtension = name.substring(0, dotIndex);
      const s3Key = `${fileNameWithoutExtension}_${Date.now()}.${fileExtension}`;

      const { data } = await mainApiProtected.getPresignedPost(s3Key);

      const fd = new FormData();
      Object.entries(data.fields).map(([key, value]) => fd.append(key, value as string));
      fd.append('file', fileData.file);

      await S3Api.uploadFileToS3(data.url, fd, fileData.file.type);

      return {
        s3Key,
        filename: name,
      };
    };

    const response = await uploadFileToS3Action(fileData.file);

    updateFileData(fileData, LoadStates.IDLE, response);
  } catch (error: any) {
    console.error(error);
    updateFileData(fileData, LoadStates.ERROR);
  }
};

export const completeFilesUploadAction = (
  body: ICompleteFilesUpload,
  orderId: string,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.completeFilesUpload(body);

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Files have been updated',
      additionalText: `Files have been updated for ${orderId}`,
    }));
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

export const updateOrderStatusAction = (
  orderId: string,
  body: IUpdateOrderBody,
): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.updateOderStatus(orderId, body);

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success',
      additionalText: 'Order status have been updated',
    }));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      type: PopupTypes.ERROR,
      mainText: 'Error',
      additionalText: errorMessage,
    }));
  }
};

export const changeRegionAction = (
  index: number,
): AsyncAction => async (
  dispatch,
  getState,
) => {
  try {
    dispatch(orderActions.setSelectedRegion(index));
    dispatch(orderActions.setSelectedService(0));
    dispatch(orderActions.changeRegion());

    const { services } = getState().order;

    if (services?.length) {
      const serviceIndex = getRegionsData()[index].services.findIndex((el) => {
        const foundedService = services.find((service) => el.productId === service.productId);

        return !!foundedService;
      });

      dispatch(orderActions.setSelectedService(serviceIndex >= 0 ? serviceIndex : 0));
    }
  } catch (error: any) {
    console.error(error);
  }
};
