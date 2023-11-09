import { createSelector, Selector } from 'reselect';

import {
  IFoundedItems,
  IInitialOrderData,
  IInitialStandardSearcheData,
  IPlaceOrderResult,
  IResetOrder,
  IVerifiedItem,
  IVerifyTempData,
  TFoundedItems,
  TManualProducts,
  TPagination,
} from '@/store/reducers/order';
import { IOrganisationService } from '@/store/reducers/services';
import { OrderDetails } from '@/store/reducers/user';

import { State } from '@/store';

const orderState = (state: State) => state.order;

export const selectSelectedRegion: Selector<State, number> = createSelector(
  orderState,
  ({ selectedRegion }) => selectedRegion,
);

export const selectSelectedService: Selector<State, number> = createSelector(
  orderState,
  ({ selectedService }) => selectedService,
);

export const selectInitialOrderData: Selector<State, IInitialOrderData | null> = createSelector(
  orderState,
  ({ initialOrderData }) => initialOrderData,
);

export const selectInitialStandardSearcheData: Selector<State, IInitialStandardSearcheData | null> = createSelector(
  orderState,
  ({ initialStandardSearcheData }) => initialStandardSearcheData,
);

export const selectMatter: Selector<State, string> = createSelector(
  orderState,
  ({ matter }) => matter,
);

export const selectIsMatterError: Selector<State, string> = createSelector(
  orderState,
  ({ isMatterError }) => isMatterError,
);

export const selectShouldShowMatterError: Selector<State, boolean> = createSelector(
  orderState,
  ({ shouldShowMatterError }) => shouldShowMatterError,
);

export const selectShouldScrollToMatter: Selector<State, boolean> = createSelector(
  orderState,
  ({ shouldScrollToMatter }) => shouldScrollToMatter,
);

export const selectOrderManuallyProducts: Selector<State, TManualProducts> = createSelector(
  orderState,
  ({ orderManuallyProducts }) => orderManuallyProducts,
);

export const selectOrderProducts: Selector<State, IFoundedItems[] | null> = createSelector(
  orderState,
  ({ orderProducts }) => orderProducts,
);

export const selectProducts: Selector<State, IOrganisationService[] | null> = createSelector(
  orderState,
  ({ products }) => products,
);

export const selectServices: Selector<State, IOrganisationService[] | null> = createSelector(
  orderState,
  ({ services }) => services,
);

export const selectCurrentService: Selector<State, IOrganisationService | null> = createSelector(
  orderState,
  ({ currentService }) => currentService,
);

export const selectCurrentServiceName: Selector<State, string> = createSelector(
  orderState,
  ({ selectedServiceName }) => selectedServiceName,
);

export const selectOrder: Selector<State, OrderDetails | null> = createSelector(
  orderState,
  ({ order }) => order,
);

export const selectSearchError: Selector<State, string | null> = createSelector(
  orderState,
  ({ searchError }) => searchError,
);

export const selectVerifyTempData: Selector<State, IVerifyTempData | null> = createSelector(
  orderState,
  ({ verifyTempData }) => verifyTempData,
);

export const selectVerifiedItems: Selector<State, IVerifiedItem[] | null> = createSelector(
  orderState,
  ({ verifiedItems }) => verifiedItems,
);

export const selectFoundedItems: Selector<State, TFoundedItems | null> = createSelector(
  orderState,
  ({ foundedItems }) => foundedItems,
);

export const selectPagination: Selector<State, TPagination> = createSelector(
  orderState,
  ({ pagination }) => pagination,
);

export const selectIsResultsVisible: Selector<State, boolean> = createSelector(
  orderState,
  ({ isResultsVisible }) => isResultsVisible,
);

export const selectShouldClearManualItems: Selector<State, boolean> = createSelector(
  orderState,
  ({ shouldClearManualItems }) => shouldClearManualItems,
);

export const selectResetOrder: Selector<State, IResetOrder | null> = createSelector(
  orderState,
  ({ resetOrder }) => resetOrder,
);

export const selectIsOrderStarted: Selector<State, boolean> = createSelector(
  orderState,
  ({ isOrderStarted }) => isOrderStarted,
);

export const selectPlaceOrderResults: Selector<State, IPlaceOrderResult[] | null> = createSelector(
  orderState,
  ({ placeOrderResults }) => placeOrderResults,
);

export const selectProductToScroll: Selector<State, string | null> = createSelector(
  orderState,
  ({ productToScroll }) => productToScroll,
);

export const selectVerifyResponsesStatus: Selector<State, boolean> = createSelector(
  orderState,
  ({ isVerifyResponsesStatus }) => isVerifyResponsesStatus,
);
