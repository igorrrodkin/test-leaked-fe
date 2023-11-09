import axios, { AxiosInstance, AxiosResponse } from 'axios';

class HttpClientGoogleApi {
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
    this.instance.interceptors.response.use(this.responseSuccess);
  };

  private responseSuccess = (response: AxiosResponse) => response.data.data;
}

export default HttpClientGoogleApi;
