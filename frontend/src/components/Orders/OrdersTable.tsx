import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import base64 from 'base-64';

import Checkbox from '@/components/Checkbox';
import ManuallyFulfillment from '@/components/Dashboard/ManuallyFulfillment';
import OderModal from '@/components/Dashboard/OderModal';
import OrderInfoModal from '@/components/Dashboard/OrderInfoModal';
import OrderActions from '@/components/Orders/OrderActions';
import StatusBox from '@/components/Orders/Status';
import UserInfo from '@/components/Orders/UserInfo';
import Table, { ITableHeader, ITableRow } from '@/components/Table/Table';

import { userActions } from '@/store/actions/userActions';

import { EOrderItemType } from '@/store/reducers/order';
import { Order, OrderStatusEnum, Roles } from '@/store/reducers/user';

import { selectUser } from '@/store/selectors/userSelectors';

import convertTimestamp from '@/utils/convertTimestamp';
import getOrderStatus from '@/utils/getOrderStatus';

import { AppDispatch } from '@/store';

enum OrderColumns {
  CheckBox = 'checkbox',
  OrderId = 'order_id',
  Organisation = 'organisation',
  Matter = 'matter',
  Service = 'service',
  Description = 'description',
  Status = 'status',
  Date = 'date',
  User = 'user',
  Action = 'action',
}

interface Props {
  orders: Order[];
  selectedOrders: Order[],
  setSelectedOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  isMatter: boolean;
}

const OrdersTable: React.FC<Props> = ({
  orders,
  selectedOrders,
  setSelectedOrders,
  isMatter,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser)!;
  const [orderPreviewId, setOrderPreviewId] = useState<string | null>(null);
  const [attachOrderId, setAttachOrderId] = useState<string | null>(null);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const modalOrderId = refundOrderId || cancelOrderId;

  const isDisable = (order: Order) => !(
    order.status === OrderStatusEnum.COMPLETE
    && order.orderItems[0]?.itemType !== 'search'
    && order.orderItems[0]?.fileKeys?.length
  );

  const allPossibleOrderChoose = useMemo(
    () => (orders || []).filter((order) => !isDisable(order)),
    [orders],
  );

  const isAllChecked = useMemo(
    () => allPossibleOrderChoose.every((order) => (
      selectedOrders.some((selectedOrder) => order.id === selectedOrder.id)
    )),
    [allPossibleOrderChoose, selectedOrders],
  );

  const selectAllCheckboxes = () => {
    if (isAllChecked) {
      const removedSelectedOrganisations = selectedOrders.filter(
        ({ id }) => !allPossibleOrderChoose.some((order) => id === order.id),
      );
      setSelectedOrders(removedSelectedOrganisations);
      return;
    }

    const allSelectedOrg = allPossibleOrderChoose.reduce((acc, order) => {
      if (acc.some(({ id }) => order.id === id)) {
        return acc;
      }

      return [...acc, order];
    }, selectedOrders);

    setSelectedOrders(allSelectedOrg);
  };

  const onCheckboxClick = (isChecked: boolean, order: Order) => {
    setSelectedOrders((prevState) => {
      if (!isChecked) return prevState.filter((el) => el.id !== order.id);

      if (order.orderItems[0].fileKeys.length) {
        return [...prevState, order];
      }

      return prevState;
    });
  };

  const handleOrderClose = () => {
    setRefundOrderId(null);
    setCancelOrderId(null);
  };

  const handleRowClick = (order: Order) => (
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const orgId = order.organisation.id;
      const matterId = order.matter;
      const orderId = order.id;
      const orderItem = order.orderItems[0];

      if (order.status === OrderStatusEnum.EXPIRED) return;

      let url;
      let query: string;

      if (orderItem?.itemType === EOrderItemType.PURCHASE) {
        url = `${orgId}/${matterId}`;
        query = `orderId=${orderId}`;

        if (orderItem?.fileKeys?.length) {
          query += '&linkId=0';
        }
      } else url = orderId;

      url += `?${base64.encode(query!)}`;

      const { location } = window;

      dispatch(userActions.setVisitedOrderDetailsFrom(location.pathname + location.search));

      if (e.metaKey || e.ctrlKey) {
        window.open(
          `${location.origin}/dashboard/orders/${url}`,
          '_blank',
        );
      }

      dispatch(userActions.setVisitedListResultFrom(location.pathname + location.search));
      navigate(`/dashboard/orders/${url}`);
    }
  );

  const handleMatterClick = (matter: string, orgId: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();

    const { location } = window;
    dispatch(userActions.setVisitedMatterFrom(location.pathname + location.search));

    const query = `${base64.encode(`matter=${base64.encode(matter)}&organisationId=${orgId}`)}`;

    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${window.location.origin}/dashboard/matters/orders?${query}`,
        '_blank',
      );
      return;
    }

    navigate(`/dashboard/matters/orders?${query}`);
  };

  const isOrderClickable = ({ status }: Order) => {
    if (status === OrderStatusEnum.CANCELLED || status === OrderStatusEnum.EXPIRED) {
      return false;
    }

    return !(status === OrderStatusEnum.REFUNDED && user.role !== Roles.SYSTEM_ADMIN);
  };

  const headers: ITableHeader = useMemo(
    () => ({
      columns: [
        {
          id: OrderColumns.CheckBox,
          content: (
            <Checkbox
              type="checkbox"
              checked={isAllChecked}
              onChange={selectAllCheckboxes}
              disabled={!allPossibleOrderChoose.length}
            />
          ),
        },
        ...(user.role === Roles.SYSTEM_ADMIN ? [{
          id: OrderColumns.OrderId,
          content: 'ORDER ID',
        }] : []),
        ...(user.role === Roles.SYSTEM_ADMIN ? [{
          id: OrderColumns.Organisation,
          content: 'ORGANISATION',
        }] : []),
        {
          id: OrderColumns.Matter,
          content: 'MATTER',
        },
        {
          id: OrderColumns.Service,
          content: 'SERVICE',
        },
        {
          id: OrderColumns.Description,
          content: 'DESCRIPTION',
        },
        {
          id: OrderColumns.Status,
          content: 'STATUS',
        },
        {
          id: OrderColumns.Date,
          content: 'USER',
        },
        {
          id: OrderColumns.User,
          content: 'DATE',
        },
        {
          id: OrderColumns.Action,
          content: 'ACTION',
        },
      ],
    }),
    [isAllChecked, allPossibleOrderChoose],
  );

  const rows: ITableRow[] = useMemo(
    () => orders.map((order, i) => ({
      id: order.id,
      isSelectedRow: false,
      ...(isOrderClickable(order)
        ? { onRowClick: handleRowClick(order) }
        : {}),
      columns: [
        {
          id: `${OrderColumns.CheckBox}-${order.id}`,
          content: (
            <Checkbox
              type="checkbox"
              disabled={isDisable(order)}
              checked={!!selectedOrders.find((el) => el.id === order.id)}
              onChange={({ target }) => onCheckboxClick(target.checked, order)}
            />
          ),
        },
        ...(user.role === Roles.SYSTEM_ADMIN ? [{
          id: `${OrderColumns.OrderId}-${order.id}`,
          content: order.id,
        }] : []),
        ...(user.role === Roles.SYSTEM_ADMIN ? [{
          id: `${OrderColumns.Organisation}-${order.id}`,
          content: order.organisation.name,
        }] : []),
        {
          id: `${OrderColumns.Matter}-${order.id}`,
          content: order.matter,
          ...(!isMatter ? { onClick: handleMatterClick(order.matter, order.organisation.id) } : {}),
        },
        {
          id: `${OrderColumns.Service}-${order.id}`,
          content: order.service,
        },
        {
          id: `${OrderColumns.Description}-${order.id}`,
          content: order.description,
        },
        {
          id: `${OrderColumns.Status}-${order.id}`,
          content: (
            <StatusBox
              status={getOrderStatus(
                order.status,
                order.orderItems[0]?.itemType,
              )}
            />
          ),
        },
        {
          id: `${OrderColumns.User}-${order.id}`,
          content: <UserInfo firstName={order.user.firstName} lastName={order.user.lastName} />,
        },
        {
          id: `${OrderColumns.Date}-${order.id}`,
          content: convertTimestamp(order.date),
        },
        {
          id: `${OrderColumns.Action}-${order.id}`,
          content: (
            <OrderActions
              order={order}
              setAttachOrderId={setAttachOrderId}
              setOrderPreviewId={setOrderPreviewId}
              refundHandler={setRefundOrderId}
              cancelOrderHandler={setCancelOrderId}
              isLast={orders.length - i < 3 && orders.length > 3}
              isFirst={orders.length === 1}
            />
          ),
        },
      ],
    })),
    [orders, selectedOrders],
  );

  return (
    <>
      <Table header={headers} rows={rows} />
      {attachOrderId && (
        <ManuallyFulfillment
          close={() => setAttachOrderId(null)}
          orderId={attachOrderId}
        />
      )}
      {modalOrderId && (
        <OderModal
          orderId={modalOrderId}
          onClose={handleOrderClose}
          isCancel={!!cancelOrderId}
        />
      )}
      {orderPreviewId && (
        <OrderInfoModal
          orderId={orderPreviewId}
          close={() => setOrderPreviewId(null)}
        />
      )}
    </>
  );
};

export default OrdersTable;
