import { IPinedServices } from '@/pages/AllServices';

import { IOrganisationService } from '@/store/reducers/services';

export enum LocalKey {
  PinedServices = 'pinned_services',
  RecentSearches = 'recent_searches',
  RecentServices = 'recent_services',
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}

export default class LocalStorage {
  static getPinedServices(): IPinedServices {
    const pinnedServices = JSON.parse(window.localStorage.getItem(LocalKey.PinedServices) || '{}');
    return pinnedServices;
  }

  static setPinedServices(pinnedServices: IPinedServices) {
    window.localStorage.setItem(LocalKey.PinedServices, JSON.stringify(pinnedServices));
  }

  static getRecentSearches(): string[] {
    const recentSearches = JSON.parse(window.localStorage.getItem(LocalKey.RecentSearches) || '[]');
    return recentSearches;
  }

  static setRecentSearches(recentSearches: string[]) {
    window.localStorage.setItem(LocalKey.RecentSearches, JSON.stringify(recentSearches));
  }

  static getRecentServices(): IOrganisationService[] {
    const pinnedServices = JSON.parse(window.localStorage.getItem(LocalKey.RecentServices) || '[]');
    return pinnedServices;
  }

  static setRecentServices(recentServices: IOrganisationService[]) {
    window.localStorage.setItem(LocalKey.RecentServices, JSON.stringify(recentServices));
  }

  static getAccessToken() {
    const accessToken = window.localStorage.getItem(LocalKey.AccessToken);
    return accessToken;
  }

  static setAccessToken(accessToken: string) {
    window.localStorage.setItem(LocalKey.AccessToken, accessToken);
  }

  static getRefreshToken() {
    const refreshToken = window.localStorage.getItem(LocalKey.RefreshToken);
    return refreshToken;
  }

  static setRefreshToken(refreshToken: string) {
    window.localStorage.setItem(LocalKey.RefreshToken, refreshToken);
  }

  static clearByKey(key: LocalKey) {
    window.localStorage.removeItem(key);
  }

  static clear() {
    window.localStorage.clear();
  }
}
