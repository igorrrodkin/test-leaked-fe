import { AxiosRequestConfig } from 'axios';

import HttpClient from '@/api/httpClient';

import LocalStorage from '@/utils/localStorage';

export class HttpClientProtected extends HttpClient {
  constructor() {
    super(process.env.URL_API);

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.instance.interceptors.request.use(this.requestInterceptor);
  }

  private requestInterceptor(config: AxiosRequestConfig) {
    const token = LocalStorage.getAccessToken();

    config.headers!.Authorization = `Bearer ${token}`;

    return config;
  }
}
