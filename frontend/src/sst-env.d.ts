/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly STRIPE_PK: string
  readonly SENTRY_DSN_FE: string
  readonly GOOGLE_API_KEY: string
  readonly INTERCOM_APP_ID: string
  readonly STAGE: string
  readonly URL_API: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}