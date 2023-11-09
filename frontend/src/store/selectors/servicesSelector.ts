import { createSelector, Selector } from 'reselect';

import { IPinedServices } from '@/pages/AllServices';

import { IOrganisationService, IService } from '@/store/reducers/services';

import { ExistingRegions } from '@/utils/getRegionsData';

import { State } from '@/store';

const userState = (state: State) => state.services;

export const selectServices: Selector<State, IService[]> = createSelector(
  userState,
  ({ services }) => services.filter(({ region }) => !!ExistingRegions[region]),
);

export const selectOrganisationServices: Selector<State, IOrganisationService[]> = createSelector(
  userState,
  ({ organisationServices }) => organisationServices,
);

export const selectServicesModal: Selector<State, boolean> = createSelector(
  userState,
  ({ servicesModal }) => servicesModal,
);

export const selectIsServicesLoading: Selector<State, boolean> = createSelector(
  userState,
  ({ isServicesLoading }) => isServicesLoading,
);

export const selectPinedServices: Selector<State, IPinedServices | null> = createSelector(
  userState,
  ({ pinnedServices }) => pinnedServices,
);

export const selectUserServices: Selector<State, IService[]> = createSelector(
  userState,
  ({ userServices }) => userServices,
);
export const selectIsUserServicesLoading: Selector<State, boolean> = createSelector(
  userState,
  ({ isUserServicesLoading }) => isUserServicesLoading,
);
