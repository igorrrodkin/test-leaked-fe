import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import base64 from 'base-64';
import PDFMerger from 'pdf-merger-js/browser';
import styled, { css } from 'styled-components';

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import DownloadIcon from '@/assets/icons/DownloadIcon';
import EmailIcon from '@/assets/icons/EmailIcon';
import InfoIconTransparent from '@/assets/icons/InfoIconTransparent';
import PrintIcon from '@/assets/icons/PrintIcon';

import Loader from '@/components/Loader';
import OrderInfo from '@/components/OrderDetails/OrderInfo';
import OrderItem from '@/components/OrderDetails/OrderItem';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';

import { downloadDocuments, sendDocumentsToEmailAction } from '@/store/actions/orderActions';
import {
  getMatterDetailsAction,
  userActions,
} from '@/store/actions/userActions';

import { IGetPreSignedGetURL } from '@/store/reducers/order';
import {
  IFileKey,
  ISendToEmailBody,
  OrderDetails as IOrderDetails, OrderItems,
  OrderStatusEnum, PopupTypes,
  Roles,
} from '@/store/reducers/user';

import {
  selectMatterDetails,
  selectUser, selectVisitedOrderDetailsFrom,
} from '@/store/selectors/userSelectors';

import useIsFirstRender from '@/hooks/useIsFirstRender';
import useToggle from '@/hooks/useToggle';

import { getObjectFromQueries } from '@/utils/api';
import isNumber from '@/utils/isNumber';
import printPdf from '@/utils/printPdf';

import { mainApiProtected } from '@/api';
import { AppDispatch } from '@/store';

type SelectedItems = { [k in string]: number[] };

interface Query {
  orderId: string,
  linkId?: string,
}

interface Props {
  baseRoute: string,
  linkId: number | null,
  orders: IOrderDetails[],
  orderItems: OrderItems[],
  order: IOrderDetails,
}

const OrderDetails: React.FC<Props> = ({
  baseRoute,
  linkId,
  orders,
  orderItems,
  order,
}) => {
  const [isInitialSelect, toggleIsInitialSelect] = useToggle();
  const [isInfoVisible, toggleIsInfoVisible] = useToggle();
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [selectedDocument, setSelectedDocument] = useState<string>();
  const ref = useRef<HTMLIFrameElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchParams = useLocation().search;

  const visiterOrderDetailsFrom = useSelector(selectVisitedOrderDetailsFrom);

  const { orderId } = useMemo(() => {
    const decoded = base64.decode(searchParams.slice(1));

    return getObjectFromQueries(decoded) as Query;
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      dispatch(userActions.setOrderDetails(null));
    };
  }, []);

  useEffect(() => {
    if (
      isInitialSelect
      && order
      && order.orderItems.length
      && order.orderItems[0].fileKeys?.length
      && (order.orderItems[0]?.itemType !== 'search'
        || order.orderItems[0].identifier === 'HTONSS')
    ) {
      setSelectedItems({
        [order.id]: new Array(order.orderItems[0].fileKeys.length).fill(1).map((_, i) => i),
      });
      toggleIsInitialSelect(false);
    }
  }, [orders, order]);

  useEffect(() => {
    const selectedOrder = orders.find((el) => el.id === order.id);

    if (isNumber(linkId) && selectedOrder?.orderItems[0].fileKeys[linkId!]) {
      getPdf(selectedOrder.orderItems[0].fileKeys[linkId!].s3Key);
    } else {
      setSelectedDocument(undefined);
    }
  }, [linkId, order]);

  const getPdf = async (s3Key: string) => {
    if (s3Key) {
      const body: IGetPreSignedGetURL = {
        orderId: order.id,
        links: [s3Key],
      };

      const preSignedURL = await mainApiProtected.getPreSignedGet([body]);

      axios.get(preSignedURL[0].links[0], { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const blobURL = URL.createObjectURL(blob);
          setSelectedDocument(blobURL);
        })
        .catch(() => {
          dispatch(userActions.setPopup({
            mainText: 'Error',
            additionalText: 'Something went wrong',
            type: PopupTypes.ERROR,
          }));
          setSelectedDocument(undefined);
        });
    }
  };

  const onCheckboxClick = (isChecked: boolean, itemOrderId: string, itemId?: number) => {
    setSelectedItems((prevState) => {
      if (!isChecked) {
        if (typeof itemId === 'undefined') {
          const updatedState = { ...prevState };
          delete updatedState[itemOrderId];
          return updatedState;
        }

        const indexes = prevState[itemOrderId].filter((el) => el !== itemId);
        const updatedState = {
          ...prevState,
          [itemOrderId]: indexes,
        };

        if (!indexes.length) delete updatedState[itemOrderId];

        return updatedState;
      }

      let newIndexes: number[];

      if (typeof itemId === 'number') {
        newIndexes = prevState[itemOrderId] ? prevState[itemOrderId] : [];
        newIndexes.push(itemId);
      } else {
        const foundedOrder = orders.find((el) => el.id === itemOrderId)!;

        newIndexes = new Array(foundedOrder.orderItems[0].fileKeys.length).fill(1).map((_, i) => i);
      }

      return {
        ...prevState,
        [itemOrderId]: newIndexes,
      };
    });
  };

  const download = () => {
    if (Object.keys(selectedItems).length) {
      const fileKeys: {
        orderId: string,
        fileKeys: IFileKey[],
      }[] = [];

      Object.entries(selectedItems).forEach(([key, value]) => {
        const foundedOrder = orders.find((el) => el.id === key);

        if (foundedOrder) {
          const filteredLinks = foundedOrder.orderItems[0].fileKeys
            .filter((_, i) => i === value.find((v) => v === i));

          if (filteredLinks.length) {
            fileKeys.push({
              orderId: foundedOrder.id,
              fileKeys: filteredLinks,
            });
          }
        }
      });

      if (fileKeys.length) dispatch(downloadDocuments(fileKeys));
    }
  };

  const print = async () => {
    if (Object.keys(selectedItems).length) {
      const urls: IGetPreSignedGetURL[] = [];

      Object.keys(selectedItems).forEach((el) => {
        const foundedOrder = orders?.find((o) => o.id === el);

        if (foundedOrder && foundedOrder.orderItems[0].fileKeys?.length) {
          const mappedLinks = selectedItems[foundedOrder.id]
            .map((i) => foundedOrder.orderItems[0].fileKeys[i].s3Key);

          mappedLinks.forEach((fileKey) => {
            const body: IGetPreSignedGetURL = {
              orderId: order.id,
              links: [fileKey],
            };

            urls.push(body);
          });
        }
      });

      const preSignedUrls = await mainApiProtected.getPreSignedGet(urls);

      const values = await Promise.all(preSignedUrls.flatMap((url) => (
        url.links.map((el: string) => axios.get(el, { responseType: 'blob' }))
      )));

      const merger = new PDFMerger();

      for (let i = 0; i < values.length; i += 1) {
        await merger.add(
          new Blob([values[i].data], { type: 'application/pdf' }),
        );
      }

      const mergedPdf = await merger.saveAsBlob();
      printPdf(mergedPdf);
    }
  };

  const sendToEmail = () => {
    if (Object.keys(selectedItems).length) {
      const links: ISendToEmailBody[] = [];

      Object.entries(selectedItems).forEach(([key, value]) => {
        const foundedOrder = orders.find((o) => o.id === key);

        if (foundedOrder) {
          const orderLinks: IFileKey[] = [];

          value.forEach((v) => {
            orderLinks.push(foundedOrder.orderItems[0].fileKeys[v]);
          });

          links.push({
            orderId: foundedOrder.id,
            itemId: foundedOrder.orderItems[0].id,
            fileKeys: orderLinks,
            ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
          });
        }
      });

      dispatch(sendDocumentsToEmailAction(links));
    }
  };

  const goBack = () => {
    if (visiterOrderDetailsFrom) {
      navigate(visiterOrderDetailsFrom);
      return;
    }

    navigate('/dashboard/matters');
  };

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <ArrowBackIcon
          onClick={goBack}
        />
        <PageTitle marginBottom="0">
          {order.matter}
        </PageTitle>
      </PageHeader>
      <Content>
        <Grid>
          <LeftSide>
            {isInfoVisible && (
              <Box padding="24px">
                <OrderInfo
                  order={orders.find((el) => el.id === order.id)!}
                  close={toggleIsInfoVisible}
                />
              </Box>
            )}
            <div>
              <DocumentsNavigation>
                <DocumentsNavItem isActive>DOCUMENT</DocumentsNavItem>
              </DocumentsNavigation>
              {selectedDocument ? (
                <IFrame ref={ref} src={`${selectedDocument}#zoom=FitW`} />
              ) : (
                <Box padding="300px 0" isCentered>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.9951 2H8.99512C7.89512 2 6.99512 2.9 6.99512 4V16C6.99512 17.1 7.89512 18 8.99512 18H20.9951C22.0951 18 22.9951 17.1 22.9951 16V4C22.9951 2.9 22.0951 2 20.9951 2ZM12.4951 9.5C12.4951 10.33 11.8251 11 10.9951 11H9.99512V12.25C9.99512 12.66 9.65512 13 9.24512 13C8.83512 13 8.49512 12.66 8.49512 12.25V8C8.49512 7.45 8.94512 7 9.49512 7H10.9951C11.8251 7 12.4951 7.67 12.4951 8.5V9.5ZM17.4951 11.5C17.4951 12.33 16.8251 13 15.9951 13H13.9951C13.7151 13 13.4951 12.78 13.4951 12.5V7.5C13.4951 7.22 13.7151 7 13.9951 7H15.9951C16.8251 7 17.4951 7.67 17.4951 8.5V11.5ZM21.4951 7.75C21.4951 8.16 21.1551 8.5 20.7451 8.5H19.9951V9.5H20.7451C21.1551 9.5 21.4951 9.84 21.4951 10.25C21.4951 10.66 21.1551 11 20.7451 11H19.9951V12.25C19.9951 12.66 19.6551 13 19.2451 13C18.8351 13 18.4951 12.66 18.4951 12.25V8C18.4951 7.45 18.9451 7 19.4951 7H20.7451C21.1551 7 21.4951 7.34 21.4951 7.75ZM9.99512 9.5H10.9951V8.5H9.99512V9.5ZM3.99512 6C3.44512 6 2.99512 6.45 2.99512 7V20C2.99512 21.1 3.89512 22 4.99512 22H17.9951C18.5451 22 18.9951 21.55 18.9951 21C18.9951 20.45 18.5451 20 17.9951 20H5.99512C5.44512 20 4.99512 19.55 4.99512 19V7C4.99512 6.45 4.54512 6 3.99512 6ZM14.9951 11.5H15.9951V8.5H14.9951V11.5Z"
                      fill="#6C7278"
                    />
                  </svg>
                  PDF PREVIEW GOES HERE
                </Box>
              )}
            </div>
          </LeftSide>
          <Box maxWidth="333px" height="min-content" padding="32px 0">
            <Actions>
              <span>Actions:</span>
              <ActionsIcons>
                <IconWrapper
                  onClick={download}
                  isActive={!!Object.keys(selectedItems).length}
                >
                  <DownloadIcon />
                </IconWrapper>
                <IconWrapper
                  onClick={print}
                  isActive={!!Object.keys(selectedItems).length}
                >
                  <PrintIcon />
                </IconWrapper>
                <IconWrapper
                  onClick={sendToEmail}
                  isActive={!!Object.keys(selectedItems).length}
                >
                  <EmailIcon />
                </IconWrapper>
                <IconWrapper onClick={toggleIsInfoVisible}>
                  <InfoIconTransparent />
                </IconWrapper>
              </ActionsIcons>
            </Actions>
            {orderItems.map((el) => (
              <OrderItem
                key={el.orderId}
                orderItem={el}
                description={orders.find((o) => o.id === el.orderId)?.description}
                selectedLinks={selectedItems[el.orderId] || []}
                isPreview={orderId === el.orderId}
                linkPreview={order.id === el.orderId ? linkId : null}
                baseRoute={baseRoute}
                checkboxClickHandler={onCheckboxClick}
              />
            ))}
          </Box>
        </Grid>
      </Content>
    </PageContainer>
  );
};

const ProtectedOrderDetails = () => {
  const [isPassed, toggleIsPassed] = useToggle();

  const { matterId, organisationId } = useParams();
  const searchParams = useLocation().search;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isFirstRender = useIsFirstRender();

  const query = useMemo(() => {
    const decodedQuery = base64.decode(searchParams.slice(1));

    return getObjectFromQueries(decodedQuery) as Query;
  }, [searchParams]);

  const orders = useSelector(selectMatterDetails);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (matterId && organisationId) {
      getData();
    }

    return () => {
      dispatch(userActions.setVisitedOrderDetailsFrom(null));
    };
  }, [matterId, user]);

  const orderDetails = useMemo(() => {
    if (orders?.length && user) {
      return orders.find((el) => el.id === query.orderId);
    }

    return undefined;
  }, [orders, user, query.orderId]);

  useEffect(() => {
    if (!isFirstRender) {
      if (isNumber(orders?.length) && user && orderDetails) {
        if (orderDetails.status === OrderStatusEnum.CANCELLED) {
          navigate('/dashboard/orders', {
            replace: true,
          });
          return;
        }

        if (
          orderDetails.status === OrderStatusEnum.REFUNDED
          && user.role !== Roles.SYSTEM_ADMIN
        ) {
          navigate('/dashboard/orders', {
            replace: true,
          });
          return;
        }

        toggleIsPassed(true);
        return;
      }

      navigate('/dashboard/orders', {
        replace: true,
      });
    }
  }, [orders, user, orderDetails]);

  const getData = async () => {
    try {
      await dispatch(getMatterDetailsAction(matterId!, +organisationId!));
    } catch (e) {
      navigate('/dashboard/orders', {
        replace: true,
      });
    }
  };

  return isPassed
    ? (
      <OrderDetails
        orders={orders!}
        linkId={query.linkId ? +query.linkId : null}
        baseRoute={`/dashboard/orders/${organisationId}/${matterId}?`}
        orderItems={orders!.map((el) => el.orderItems[0])}
        order={orderDetails!}
      />
    )
    : <Loader />;
};

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 24px;
  margin-bottom: 32px;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgba(26, 28, 30, 0.16);

  svg {
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr minmax(333px, auto);
  grid-gap: 16px;

  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column-reverse;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
`;

const Box = styled.div<{
  padding?: string;
  height?: string;
  isCentered?: boolean;
  maxWidth?: string;
}>`
  max-width: ${({ maxWidth = 'auto' }) => maxWidth};
  padding: ${({ padding = '32px' }) => padding};
  height: ${({ height = 'auto' }) => height};
  border: 1px solid #dce4e8;
  border-radius: 12px;

  ${({ isCentered }) => (isCentered
    ? css`
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    grid-gap: 32px;
                    font-size: 14px;
                    font-weight: 600;
                  `
    : '')}
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 24px;
  margin: 0 32px 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dce4e8;

  & > span {
    font-size: 14px;
    font-weight: 600;
  }
`;

const ActionsIcons = styled.div`
  display: flex;
  grid-gap: 16px;
  align-items: center;
`;

const IconWrapper = styled.div<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #edf1f3;
  transition: 0.2s ease-in-out;

  :hover {
    background-color: #dde4e6;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ isActive = true }) => (!isActive
    ? css`
                    background-color: rgba(237, 241, 243, 0.6);
                    cursor: default;

                    :hover {
                      background-color: rgba(237, 241, 243, 0.7);
                    }
                  `
    : '')}
`;

const DocumentsNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid #dce4e8;
  margin-bottom: 24px;
`;

const DocumentsNavItem = styled.p<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: ${({ isActive }) => (isActive ? 'inherit' : '#6C7278')};
  background-color: ${({ isActive }) => (isActive ? '#D4FADD' : 'inherit')};
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100vh;
  border: 0;
`;

export default ProtectedOrderDetails;
