import { StackContext, StaticSite } from 'sst/constructs';

export function ExampleStack({ stack }: StackContext) {
  const site = new StaticSite(stack, 'React-App', {
    buildOutput: 'dist',
    buildCommand: 'npm i && npm run build',
    errorPage: 'redirect_to_index_page',
    path: './frontend',
    // customDomain: {
    //   domainName: process.env.DOMAIN!,
    //   hostedZone: process.env.HOSTED_ZONE
    // },
    environment: {
      STRIPE_PK: process.env.STRIPE_PK,
      SENTRY_DSN_FE: process.env.SENTRY_DSN_FE,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      INTERCOM_APP_ID: process.env.INTERCOM_APP_ID,
      STAGE: process.env.STAGE,
      URL_API: process.env.URL_API,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
