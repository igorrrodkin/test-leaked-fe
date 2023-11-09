import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const config = {
  dsn: process.env.SENTRY_DSN_FE,
  environment: process.env.STAGE,
  sampleRate: 1.0,
  defaultSampleRate: 1.0,
};

export default class Logger {
  static initialize() {
    if (!this.isEnabled()) {
      return;
    }

    Sentry.init({
      release: `servoworks-${process.env.STAGE}`,
      dsn: config.dsn,
      environment: config.environment,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: Number(config.sampleRate) || config.defaultSampleRate,
    });
  }

  static setUser(identifier: string, context?: {}) {
    if (!this.isEnabled()) {
      return;
    }

    Sentry.setUser({ identifier, context });
  }

  static clearUser() {
    if (!this.isEnabled()) {
      return;
    }

    Sentry.configureScope((scope) => scope.setUser(null));
  }

  static addContext(contextId: string, context: {}) {
    if (!this.isEnabled()) {
      return;
    }

    Sentry.setContext(contextId, context);
  }

  static emit({ code, message }: { code: string; message: string | Error }) {
    if (!this.isEnabled()) {
      return;
    }

    Sentry.captureException({ code, message });
  }

  static isEnabled() {
    const sentryDsn = !!process.env.SENTRY_DSN_FE
      && !!process.env.SENTRY_DSN_FE.trim() && !!process.env.STAGE;
    return !!sentryDsn;
  }
}
