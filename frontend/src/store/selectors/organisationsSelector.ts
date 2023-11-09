import { createSelector, Selector } from 'reselect';

import {
  IBaseOrganisationsInfo,
  IFullOrganisation,
  IOrganisation,
} from '@/store/reducers/organisations';
import { IOrganisationService } from '@/store/reducers/services';

import { State } from '@/store';

const organisationsState = (state: State) => state.organisations;

export const selectOrganisations: Selector<State, IOrganisation[]> = createSelector(
  organisationsState,
  ({ organisations }) => organisations,
);

export const selectBaseOrganisationsInfo: Selector<State, IBaseOrganisationsInfo[]> = createSelector(
  organisationsState,
  ({ baseOrganisationsInfo }) => baseOrganisationsInfo,
);

export const selectOrganisation: Selector<State, IFullOrganisation | null> = createSelector(
  organisationsState,
  ({ organisationDetails }) => organisationDetails,
);

export const selectOrganisationServices: Selector<State, IOrganisationService[]> = createSelector(
  organisationsState,
  ({ organisationServices }) => organisationServices,
);

export const selectIsLoading: Selector<State, boolean> = createSelector(
  organisationsState,
  ({ isLoading }) => isLoading,
);
