import httpClientAuthProtected from '@/api/httpClientAuthProtected';

import { IChangePasswordBody, IUpdatePasswordBody } from '@/store/reducers/user';

class MainAuthApiProtected extends httpClientAuthProtected {
  private static instanceCached: MainAuthApiProtected;

  constructor() {
    super(process.env.URL_API);
  }

  public static getInstance = () => {
    if (!MainAuthApiProtected.instanceCached) MainAuthApiProtected.instanceCached = new MainAuthApiProtected();

    return MainAuthApiProtected.instanceCached;
  };

  public updatePassword = (body: IUpdatePasswordBody) => (
    this.instance.post('/login/change-password', body)
  );

  public changePassword = (body: IChangePasswordBody) => (
    this.instance.post<{ accessToken: string, refreshToken: string }>('/users/change-password', body)
  );
}

export default MainAuthApiProtected;
