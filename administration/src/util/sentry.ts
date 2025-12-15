import * as Sentry from '@sentry/react'

import { isProductionEnvironment } from './helper'

export const initSentry = (): void => {
  Sentry.init({
    dsn: 'https://c560d6febb909858b17b92f91d418183@sentry.tuerantuer.org/6',
    release: VITE_BUILD_VERSION_NAME,
    integrations: [Sentry.browserTracingIntegration()],
    // https://docs.sentry.io/concepts/key-terms/tracing/
    tracesSampleRate: 0.05,
  })
}

export const reportErrorToSentry = (error: unknown): void => {
  if (isProductionEnvironment()) {
    Sentry.captureException(error)
  } else {
    console.error(error)
  }
}
