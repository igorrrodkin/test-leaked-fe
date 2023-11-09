/* eslint-disable class-methods-use-this */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import base64 from 'base-64';

export default abstract class HttpAuthClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      transformRequest: [(data) => base64.encode(JSON.stringify(data))],
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    this.initializeResponseInterceptor();
  }

  protected initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse,
    );
  }

  protected handleSuccessResponse<T>({ data }: AxiosResponse<{ data: T }>): T {
    return data.data;
  }

  protected handleErrorResponse(error: any) {
    const status = error.response?.status;
    const statusCode = error.code;

    return Promise.reject({
      code: status,
      statusCode,
      message: error.response?.data?.message || '',
      isAxiosError: true,
    });
  }
}
