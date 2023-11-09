import HttpClientGoogleApi from '@/api/httpClientGoogleApi';

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface MainTextMatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MainTextMatchedSubstring[];
  secondary_text: string;
}

export interface Term {
  offset: number;
  value: string;
}

export interface Prediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Result {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface PlaceResults {
  html_attributions: string[];
  result: Result;
  status: string;
}

class MainGoogleApi extends HttpClientGoogleApi {
  private static instanceCached: MainGoogleApi;

  constructor() {
    super(process.env.URL_API);
  }

  public static getInstance = () => {
    if (!MainGoogleApi.instanceCached) { MainGoogleApi.instanceCached = new MainGoogleApi(); }

    return MainGoogleApi.instanceCached;
  };

  public getAddresses = (query: string) => this.instance.get<{ predictions: Prediction[]; status: string }>(
    `/places?${query}`,
  );

  public getPlaceById = (id: string) => this.instance.get<PlaceResults>(`/places/details/${id}`);
}

export default MainGoogleApi;
