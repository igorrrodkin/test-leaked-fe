import { createSelector, Selector } from 'reselect';

import { IPinedServices } from '@/pages/AllServices';

import {
  IMatterAws,
  IPopupMessage,
  ISettings,
  Order,
  OrderDetails,
  PriceListDetail,
  User,
} from '@/store/reducers/user';

import { State } from '@/store';

const userState = (state: State) => state.user;

export const selectUser: Selector<State, User | null> = createSelector(
  userState,
  ({ user }) => user,
);

export const selectIsLoadingUser: Selector<State, boolean> = createSelector(
  userState,
  ({ isLoadingUser }) => isLoadingUser,
);

export const selectPriceList: Selector<State, PriceListDetail | null> = createSelector(
  userState,
  ({ priceList }) => priceList,
);

export const selectOrders: Selector<State, Order[]> = createSelector(
  userState,
  ({ orders }) => orders,
);

export const selectOrdersTotal: Selector<State, number | null> = createSelector(
  userState,
  ({ ordersTotal }) => ordersTotal,
);

export const selectMatters: Selector<State, IMatterAws[]> = createSelector(
  userState,
  ({ matters }) => matters,
);

export const selectMattersTotal: Selector<State, number | null> = createSelector(
  userState,
  ({ mattersTotal }) => mattersTotal,
);

export const selectOrderDetails: Selector<State, OrderDetails | null> = createSelector(
  userState,
  ({ orderDetails }) => orderDetails,
);

export const selectMatterDetails: Selector<State, OrderDetails[] | null> = createSelector(
  userState,
  ({ matterDetails }) => matterDetails,
);

export const selectPopup: Selector<State, IPopupMessage | null> = createSelector(
  userState,
  ({ popup }) => popup,
);

export const selectSettings: Selector<State, ISettings | null> = createSelector(
  userState,
  ({ settings }) => settings,
);

export const selectPinedService: Selector<State, IPinedServices | null> = createSelector(
  userState,
  ({ pinnedServices }) => pinnedServices,
);

export const selectVisitedOrderDetailsFrom: Selector<State, string | null> = createSelector(
  userState,
  ({ visitedOrderDetailsFrom }) => visitedOrderDetailsFrom,
);

export const selectVisitedListResultFrom: Selector<State, string | null> = createSelector(
  userState,
  ({ visitedListResultFrom }) => visitedListResultFrom,
);

export const selectVisitedMatterFrom: Selector<State, string | null> = createSelector(
  userState,
  ({ visitedMatterFrom }) => visitedMatterFrom,
);
