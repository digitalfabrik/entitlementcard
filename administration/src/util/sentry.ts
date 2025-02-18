import * as Sentry from '@sentry/react'

import { isProductionEnvironment } from './helper'

export const initSentry = (): void => {
  Sentry.init({
    dsn: 'https://c560d6febb909858b17b92f91d418183@sentry.tuerantuer.org/6',
    release: `${process.env.REACT_APP_VERSION}`,
  })
}

export const reportErrorToSentry = (error: unknown): void => {
  if (isProductionEnvironment()) {
    Sentry.captureException(error)
  } else {
    console.error(error)
  }
}
