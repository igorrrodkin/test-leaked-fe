import HttpClient from '@/api/httpClient';

import { ExistingRegions } from '@/utils/getRegionsData';

export interface ISignUpBody {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  phone: string,
  organisation: string,
  state: ExistingRegions,
  abn: string,
  typeOfBusiness: string,
  password: string
}

class MainApi extends HttpClient {
  private static instanceCached: MainApi;

  constructor() {
    super(process.env.URL_API);
  }

  public static getInstance = () => {
    if (!MainApi.instanceCached) MainApi.instanceCached = new MainApi();

    return MainApi.instanceCached;
  };

  public refreshAccessToken = (refreshToken: string) => this.instance.post('/login/refresh', { refreshToken });

  public getOrderItems = () => (
    this.instance.post('/mock/wa/title-reference', {
      matterReference: 'Test',
      titleReference: '2100/341',
    })
  );
}

export default MainApi;
