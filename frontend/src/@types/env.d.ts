declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    URL_API: string;
    SENTRY_DSN_FE: string;
    STAGE: 'dev' | 'main';
    INTERCOM_APP_ID: string;
    STRIPE_PK: string;
    GOOGLE_API_KEY: string;
  }
}
