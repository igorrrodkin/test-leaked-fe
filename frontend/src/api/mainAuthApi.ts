import HttpAuthClient from '@/api/httpClientAuth';
import { ISignUpBody } from '@/api/mainApi';

class MainAuthApi extends HttpAuthClient {
  private static instanceCached: MainAuthApi;

  constructor() {
    super(process.env.URL_API);
  }

  public static getInstance = () => {
    if (!MainAuthApi.instanceCached) MainAuthApi.instanceCached = new MainAuthApi();

    return MainAuthApi.instanceCached;
  };

  public register = (body: ISignUpBody) => (
    this.instance.post('/registration', {
      ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
      ...body,
    })
  );

  public validateOtp = (username: string, otp: string) => (
    this.instance.post('/registration/validate', {
      username,
      otp,
    })
  );

  public verifyOtp = (username: string, otp: string) => (
    this.instance.post<{ access_token: string, refresh_token: string }>('/registration/verify', {
      username,
      otp,
    })
  );

  public login = (username: string, password: string) => (
    this.instance.post<{ accessToken: string, refreshToken: string }>('/login', {
      username,
      password,
    })
  );

  public forgotPassword = (username: string) => (
    this.instance.post('/login/reset-password', {
      username,
      ...(process.env.STAGE === 'dev' ? { baseUrl: window.location.origin } : {}),
    })
  );
}

export default MainAuthApi;
