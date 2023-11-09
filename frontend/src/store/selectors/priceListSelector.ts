import { createSelector, Selector } from 'reselect';

import { IPriceList } from '@/store/reducers/priceList';
import { IFullPriceListDetail, PriceListDetail } from '@/store/reducers/user';

import { State } from '@/store';

const userState = (state: State) => state.priceList;

export const selectPriceLists: Selector<State, IPriceList[] | null> = createSelector(
  userState,
  ({ priceLists }) => priceLists,
);

export const selectPriceListDetail: Selector<State, PriceListDetail | null> = createSelector(
  userState,
  ({ priceListDetail }) => priceListDetail,
);

export const selectOrganisationPriceLists: Selector<State, IFullPriceListDetail[]> = createSelector(
  userState,
  ({ organisationPriceLists }) => organisationPriceLists,
);
