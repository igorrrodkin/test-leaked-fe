import HttpClient from '@/api/httpClient';

export default class S3Api extends HttpClient {
  private static instanceCached: S3Api;

  public constructor() {
    super('');
  }

  public static getInstance = () => {
    if (!S3Api.instanceCached) S3Api.instanceCached = new S3Api();

    return S3Api.instanceCached;
  };

  public uploadFileToS3(url: string, file: FormData, fileType: string) {
    const headers = { 'Content-Type': fileType };
    return this.instance.post(url, file, { headers });
  }
}
