import axios, { AxiosInstance, AxiosResponse } from 'axios';

import MainApi from '@/api/mainApi';

import { logoutAction, userActions } from '@/store/actions/userActions';

import LocalStorage from '@/utils/localStorage';

import store from '@/store';

class HttpClient {
  protected readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeResponseInterceptor();
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this.responseSuccess, this.responseError);
  };

  private responseSuccess = (response: AxiosResponse) => response.data.data;

  private responseError = async (error: any) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const statusCode = error.code;

    if (data?.code === 401401) {
      store.dispatch(logoutAction());
      return Promise.reject({
        code: status,
        statusCode,
        message: error.response?.data?.message || '',
        isAxiosError: true,
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
        store.dispatch(userActions.logout());
        return Promise.reject({
          code: status,
          statusCode,
          message: error.response?.data?.message || '',
          isAxiosError: true,
        });
      }
    }

    return Promise.reject({
      code: status,
      statusCode,
      message: error.response?.data?.message || '',
      isAxiosError: true,
    });
  };
}

export default HttpClient;
