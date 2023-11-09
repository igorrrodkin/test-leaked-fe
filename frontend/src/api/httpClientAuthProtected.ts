/* eslint-disable class-methods-use-this */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import HttpAuthClient from '@/api/httpClientAuth';
import MainApi from '@/api/mainApi';

import { logoutAction } from '@/store/actions/userActions';

import LocalStorage from '@/utils/localStorage';

import store from '@/store';

export default abstract class HttpClientAuthProtected extends HttpAuthClient {
  public constructor(baseURL: string) {
    super(baseURL);

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  protected initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this.requestInterceptor);
  };

  private requestInterceptor(config: AxiosRequestConfig) {
    const token = LocalStorage.getAccessToken();

    config.headers!.Authorization = `Bearer ${token}`;

    return config;
  }

  protected initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this.responseSuccess, this.responseError);
  };

  protected responseSuccess = (response: AxiosResponse) => response;

  protected responseError = async (error: any) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const statusCode = error.code;

    if (data?.code === '401') {
      store.dispatch(logoutAction());
      return Promise.reject({
        code: status,
        statusCode,
        message: error.response?.data?.message || '',
      });
    }

    if (status === 0 || status === 401) {
      try {
        const refreshToken = LocalStorage.getRefreshToken();
        const newConfig = {
          ...error.config,
          headers: {
            ...error.config.headers,
            'Content-Type': 'application/json',
          },
        };

        if (refreshToken) {
          const { accessToken, refreshToken: newRefreshToken } = await new MainApi()
            .refreshAccessToken(refreshToken);

          LocalStorage.setAccessToken(accessToken);
          LocalStorage.setRefreshToken(newRefreshToken);

          newConfig.headers.Authorization = `Bearer ${accessToken}`;
        }

        return (await axios.request(newConfig)).data.data;
      } catch (_) {
        LocalStorage.clear();

        return Promise.reject({
          code: status,
          statusCode,
          message: error.response?.data?.message || '',
        });
      }
    }

    return Promise.reject({
      code: status,
      statusCode,
      message: error.response?.data?.message || '',
    });
  };
}
