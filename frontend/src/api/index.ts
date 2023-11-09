import MainApi from '@/api/mainApi';
import { MainApiProtected } from '@/api/mainApiProtected';
import MainAuthApi from '@/api/mainAuthApi';
import MainAuthApiProtected from '@/api/mainAuthApiProtected';
import S3Api from '@/api/s3';

export const mainApi = MainApi.getInstance();
export const mainApiProtected = MainApiProtected.getInstance();
export const mainAuthApi = MainAuthApi.getInstance();
export const mainAuthApiProtected = MainAuthApiProtected.getInstance();
export const s3Api = S3Api.getInstance();
