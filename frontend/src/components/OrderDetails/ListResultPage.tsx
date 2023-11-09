import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import base64 from 'base-64';
import styled from 'styled-components';

import fileEye from '@/assets/fileEye.png';
import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import CloseIcon from '@/assets/icons/CloseIcon';
import FilesCountIcon from '@/assets/icons/FilesCountIcon';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';
import NoFound from '@/components/NoFound';
import PageContainer from '@/components/PageContainer';
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Filters from '@/components/Table/Filters';

import { orderActions } from '@/store/actions/orderActions';
import { getOrderDetailsAction, userActions } from '@/store/actions/userActions';

import { IFoundedItems } from '@/store/reducers/order';
import { OrderDetails, OrderStatusEnum } from '@/store/reducers/user';

import { selectOrderDetails, selectUser, selectVisitedListResultFrom } from '@/store/selectors/userSelectors';

import useInput from '@/hooks/useInput';

import getNounByForm from '@/utils/getNounByForm';
import mapTitlesByService from '@/utils/mapTitlesByService';
import omitObjectKey from '@/utils/omitObjectKey';
import orderTableStructure from '@/utils/orderTableStructure';
import doSearch from '@/utils/search';

import { AppDispatch } from '@/store';

interface IProps {
  order: OrderDetails;
  foundedItems: IFoundedItems[];
}

const limits = [20, 50, 100];

const ListResultPage: React.FC<IProps> = ({ order, foundedItems }) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useInput();

  const visitedListResultFrom = useSelector(selectVisitedListResultFrom);

  const [selectedDetails, setSelectedDetails] = useState<IFoundedItems[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    setOffset(0);
  }, [limit]);

  const searchedItems = useMemo(() => {
    const allResults: IFoundedItems[] = (foundedItems[0]?.identifier ? orderTableStructure[
      foundedItems[0].identifier
    ][1] : []).reduce(
      (acc: IFoundedItems[], key: string) => [
        ...acc,
        ...doSearch(foundedItems, search, (item) => String(item[key])),
      ],
      [] as IFoundedItems[],
    );

    const results = new Set();

    allResults.forEach((item) => results.add(JSON.stringify(item)));

    const parseResult = [...results] as string[];
    return parseResult.map((item: string) => JSON.parse(item)) as IFoundedItems[];
  }, [foundedItems, search]);

  const detailsPagination = useMemo(() => searchedItems.slice(
    limits[limit] * offset,
    limits[limit] * offset + limits[limit],
  ), [searchedItems, limit, offset]);

  const maxPages = Math.ceil(searchedItems.length / limits[limit]);

  const calculatedOffset = maxPages > 1 ? offset : 0;

  const onCheckboxClick = (isChecked: boolean, selected: IFoundedItems) => {
    setSelectedDetails((prevState) => {
      if (!isChecked) {
        return prevState.filter(({ id }) => !(id === selected.id));
      }

      return [...prevState, selected];
    });
  };

  const handleStartOrder = () => {
    const inputData = omitObjectKey(order.orderItems[0].input, 'matterReference');
    dispatch(orderActions.setOrder(order));
    dispatch(orderActions.setFoundedItems({
      [order.orderItems[0].identifier]: searchedItems,
    }));
    dispatch(
      orderActions.setInitialOrderData({
        matter: order.matter,
        region: order.orderItems[0].region,
        identifier: order.orderItems[0].identifier,
        suburb: inputData?.locality || '',
        companyName: inputData?.name || '',
        streetNumber: inputData?.number || '',
        firstName: inputData?.givenNames || '',
        lotPlanNumber: order.orderItems[0].identifier === 'HTLPV' ? order.description : '',
        ...inputData,
      }),
    );
    dispatch(
      orderActions.setOrderProducts(
        selectedDetails.map((el) => ({
          ...el,
          isChosen: true,
          isUnable: !((el.identifier === 'HTOIQ' || el.identifier === 'HTOOQ')),
          isVerified: false,
        })),
      ),
    );

    navigate(`/${order.orderItems[0].region.toLocaleLowerCase()}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedOrganisations = selectedDetails.filter(
        ({ id }) => !detailsPagination.some((o) => id === o.id),
      );
      setSelectedDetails(removedSelectedOrganisations);
      return;
    }

    const allSelectedOrg = detailsPagination.reduce((acc, o) => {
      if (acc.some(({ id }) => o.id === id)) {
        return acc;
      }

      return [...acc, o];
    }, selectedDetails);

    setSelectedDetails(allSelectedOrg);
  };

  const isAllChecked = useMemo(
    () => detailsPagination.every((o) => selectedDetails.some((selectedOrder) => o.id === selectedOrder.id)),
    [detailsPagination, selectedDetails],
  );

  const clearAllSelectedOrder = () => {
    setSelectedDetails([]);
  };

  const getOrderInputInfo = () => {
    if (!order) {
      return '';
    }

    return `${order.service}${
      order.description ? ` - ${order.description}` : ''
    }`;
  };

  const goToOrders = () => {
    navigate('/dashboard/orders');
  };

  const goToLists = () => {
    navigate(-1);
  };

  const handleDocumentClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { orgId } = order;
    const matterId = order.matter;
    const orderId = order.id;
    const orderItem = order.orderItems[0];

    let url;
    let query: string;

    url = `${orgId}/${matterId}`;
    query = `orderId=${orderId}`;

    if (orderItem?.fileKeys?.length) {
      query += '&linkId=0';
    }

    url += `?${base64.encode(query!)}`;

    const { location } = window;

    dispatch(userActions.setVisitedOrderDetailsFrom(location.pathname + location.search));

    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${location.origin}/dashboard/orders/${url}`,
        '_blank',
      );
    }

    navigate(`/dashboard/orders/${url}`);
  };

  return (
    <PageContainer contentPadding="32px 0">
      <PageHeader>
        <ArrowBackIcon
          onClick={() => {
            if (visitedListResultFrom) {
              navigate(visitedListResultFrom);
              return;
            }
            navigate(-1);
          }}
        />
        {order.orderItems[0]?.itemType !== 'search'
        || order.orderItems[0]?.identifier === 'HTONSS' ? (
          <PageTitle marginBottom="0">{order.matter}</PageTitle>
          ) : (
            <>
              <NavLine>
                <BackSpan onClick={goToOrders}>Orders</BackSpan>
                <ArrowRightIcon />
                <BackSpan onClick={goToLists}>Lists</BackSpan>
                <ArrowRightIcon />
                <span>{getOrderInputInfo()}</span>
              </NavLine>
              <DocumentWrapper>
                <DocumentBtn
                  type="button"
                  onClick={handleDocumentClick}
                >
                  <img src={fileEye} alt="Open document" />
                </DocumentBtn>
              </DocumentWrapper>
            </>
          )}
      </PageHeader>
      <Wrapper>
        <Filters
          search={{
            searchValue: search,
            placeholder: 'Search',
            setSearchValue: (evt) => {
              handleSearch(evt);
              setOffset(0);
            },
            clear: () => setSearch(''),
          }}
        />
        {order.orderItems[0].productId === 'INT-SAPLNPRCLS' && (
        <Warning>
          Due to a current technical limitation, this search has been limited to the first page results.
          If additional pages are required, please reach out to support.
        </Warning>
        )}
        {order.status === OrderStatusEnum.COMPLETE && searchedItems.length ? (
          <>
            {!!orderTableStructure[foundedItems[0].identifier][2] && (
              <TableWrapper isExpanded={false}>
                <Table>
                  <THead>
                    <tr>
                      {orderTableStructure[foundedItems[0].identifier][2].map(
                        (el: string, i: number) => (
                          <th key={el + i}>{el}</th>
                        ),
                      )}
                    </tr>
                  </THead>
                  <TBody>
                    {detailsPagination.slice(0, 1).map((detail, i) => (
                      <TRow
                        key={i}
                      >
                        {orderTableStructure[foundedItems[0].identifier][3].map(
                          (el: string) => (
                            <th key={detail.id + el}>{detail.render[el]}</th>
                          ),
                        )}
                      </TRow>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            )}
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <CheckboxCell>
                      <Checkbox
                        type="checkbox"
                        checked={isAllChecked}
                        onChange={selectAllCheckboxes}
                      />
                    </CheckboxCell>
                    {orderTableStructure[foundedItems[0].identifier][0].map(
                      (el: string, i: number) => (
                        <th key={el + i}>{el}</th>
                      ),
                    )}
                  </tr>
                </THead>
                <TBody>
                  {detailsPagination.map((detail, i) => {
                    const isChecked = !!selectedDetails.find(
                      (detailItem) => detailItem.id === detail.id,
                    );
                    return (
                      <TRow
                        key={i}
                        isChecked={isChecked}
                        onClick={() => onCheckboxClick(!isChecked, detail)}
                      >
                        <CheckboxCell>
                          <Checkbox
                            type="checkbox"
                            checked={
                              !!selectedDetails.find(
                                (detailItem) => detailItem.id === detail.id,
                              )
                            }
                            onChange={() => onCheckboxClick(!isChecked, detail)}
                          />
                        </CheckboxCell>
                        {orderTableStructure[foundedItems[0].identifier][1].map(
                          (el: string) => (
                            <th
                              key={detail.id + el}
                              style={{
                                whiteSpace: detail.identifier === 'HTPPS' && (el === 'address' || el === 'valuations')
                                  ? 'pre-wrap' : 'initial',
                              }}
                            >
                              {detail.render[el]}

                            </th>
                          ),
                        )}
                      </TRow>
                    );
                  })}
                </TBody>
              </Table>
            </TableWrapper>
          </>
        ) : (
          <NoFound />
        )}
        {order.status === OrderStatusEnum.COMPLETE && !!searchedItems.length && (
          <Pagination
            changePage={setOffset}
            currentPage={calculatedOffset}
            maxPages={maxPages}
            maxElements={searchedItems.length}
            limits={limits}
            limit={limit}
            setLimit={setLimit}
          />
        )}
        {selectedDetails.length ? (
          <PopUp>
            <OrdersCount>
              <FilesCountIcon />
              {`${getNounByForm(selectedDetails.length, 'Item')} selected`}
            </OrdersCount>
            <ButtonWrap>
              <Button onClick={handleStartOrder} style={{ width: '140px' }}>
                Start Order
              </Button>
            </ButtonWrap>
            <Actions>
              <StyledCloseIcon handler={clearAllSelectedOrder} />
            </Actions>
          </PopUp>
        ) : (
          ''
        )}
      </Wrapper>
    </PageContainer>
  );
};

const ProtectedListResultPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const orderDetails = useSelector(selectOrderDetails);

  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      getData();
    }

    return () => {
      dispatch(userActions.setOrderDetails(null));
    };
  }, [orderId, user]);

  const getData = async () => {
    try {
      await dispatch(getOrderDetailsAction(orderId!));
    } catch (e) {
      navigate('/dashboard/orders', {
        replace: true,
      });
    }
  };

  const getMappedItems = (orderObj: OrderDetails) => {
    try {
      return mapTitlesByService(
        orderObj.orderItems[0],
        orderObj.orderItems[0].price,
        orderObj.orderItems[0].identifier,
        orderObj.description,
      );
    } catch (e: any) {
      return [];
    }
  };

  return orderDetails ? (
    <ListResultPage
      order={orderDetails!}
      foundedItems={getMappedItems(orderDetails)}
    />
  ) : <Loader />;
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

const NavLine = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
  font-weight: 500;

  span {
    color: #acb5bb;

    :last-child {
      font-weight: 600;
      color: inherit;
    }
  }
`;

const BackSpan = styled.span`
  color: #acb5bb;
  font-weight: 500;

  transition: all 0.3s ease;

  &:hover {
    color: inherit;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  padding: 0 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ButtonWrap = styled.div`
  margin-left: auto;
`;

const PopUp = styled.div`
  position: fixed;
  bottom: 100px;
  left: calc(50% + 256px / 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38px 86px 38px 32px;
  max-width: 822px;
  width: 100%;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 12px 80px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const OrdersCount = styled.p`
  display: flex;
  align-items: center;
  grid-gap: 13px;
`;

const Actions = styled.ul`
  display: flex;
  align-items: center;
  grid-gap: 16px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const TableWrapper = styled.div<{ isExpanded?: boolean }>`
  margin-bottom: 1rem;
  overflow-x: auto;
  ${({ isExpanded = true }) => (isExpanded ? 'flex: 1;' : '')}
`;

const Table = styled.table`
  display: table;
  width: 100%;
  border-spacing: 0;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;

  * {
    white-space: nowrap;
  }
`;

const THead = styled.thead`
  background-color: #f9f9f9;

  th {
    padding: 12px 35px 12px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 24, 39, 0.5);
    text-transform: uppercase;
    text-align: left;

    :first-child {
      padding: 12px;
      border-top-left-radius: 4px;
    }

    :last-child {
      border-top-right-radius: 4px;
    }
  }
`;

const TBody = styled.tbody`
  th {
    padding: 14px 35px 14px 0;
    max-width: 200px;
    height: 64px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    white-space: normal;

    :first-child {
      padding-left: 12px;
    }
  }
`;

const CheckboxCell = styled.th`
  width: 18px;
`;

const TRow = styled.tr<{ isChecked?: boolean }>`
  cursor: pointer;

  & .capitalize {
    text-transform: capitalize;
  }

  th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#fff')};
  }

  :hover th {
    background-color: ${({ isChecked }) => (isChecked ? '#E8F6FA' : '#F9F9F9')};
  }

  :last-child {
    th:first-child {
      border-bottom-left-radius: 4px;
    }

    th:last-child {
      border-bottom-right-radius: 4px;
    }
  }
`;

const Warning = styled.p`
  margin: 0 0 12px 0;
  padding: 12px 24px;
  border-left: 4px solid var(--primary-warning-color);
  background-color: var(--primary-warning-background-color);
  font-size: 18px;
  color: var(--primary-warning-color);
`;

const DocumentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const DocumentBtn = styled.button`
  padding: 10px;
  aspect-ratio: 1;
  border-style: none;
  border-radius: 10px;
  background-color: #f4f7f8;
  cursor: poinet;

  & > img {
    width: 30px;
  }
`;

export default ProtectedListResultPage;
