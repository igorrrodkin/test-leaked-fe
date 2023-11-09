import { createReducerFunction, ImmerReducer } from 'immer-reducer';

import { IFullPriceListDetail, PriceListDetail, Product } from '@/store/reducers/user';

export interface IAssignPriceList {
  organisationId: number,
  effectiveFromDate: number,
  priceListId: number,
  backendBaseUrl: string,
}

export interface IUploadPriceList {
  priceListName: string,
  description: string,
  file: File,
}

export interface IPriceList {
  id: number,
  priceListName: string,
  organisationsIds: number[],
  organisationsNames: string[],
  description: string,
  organisations: string,
  effectiveFromDate: string,
  isDefault: boolean,
  priceList: Product[],
}

interface PriceListState {
  priceLists: IPriceList[] | null,
  priceListDetail: PriceListDetail | null
  organisationPriceLists: IFullPriceListDetail[]
}

const InitialState: PriceListState = {
  priceLists: null,
  priceListDetail: null,
  organisationPriceLists: [],
};

export class PriceListReducer extends ImmerReducer<PriceListState> {
  public setPriceLists(value: IPriceList[] | null) {
    this.draftState.priceLists = value;
  }

  public setOrganisationPriceLists(organisationPriceLists: IFullPriceListDetail[]) {
    this.draftState.organisationPriceLists = organisationPriceLists;
  }

  public setPriceListDetail(value: PriceListDetail | null) {
    this.draftState.priceListDetail = value;
  }
}

export default createReducerFunction(PriceListReducer, InitialState);
