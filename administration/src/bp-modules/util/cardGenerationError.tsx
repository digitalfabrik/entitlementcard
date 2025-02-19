import { ApolloError } from '@apollo/client'
import { Toaster } from '@blueprintjs/core'
import { TFunction } from 'i18next'
import React from 'react'

import { CsvError } from '../../cards/CsvFactory'
import { PdfError } from '../../cards/PdfFactory'
import { CreateCardsError } from '../../cards/createCards'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { reportErrorToSentry } from '../../util/sentry'
import FormErrorMessage from '../self-service/components/FormErrorMessage'

export const showCardGenerationError = (appToaster: Toaster, error: unknown, t: TFunction<'errors'>): void => {
  if (error instanceof CreateCardsError) {
    appToaster.show({
      message: error.message,
      intent: 'danger',
    })
  } else if (error instanceof ApolloError) {
    const { title } = getMessageFromApolloError(error, t)
    appToaster.show({
      message: <FormErrorMessage style={{ color: 'white' }} errorMessage={title} />,
      timeout: 0,
      intent: 'danger',
    })
  } else if (error instanceof PdfError) {
    appToaster.show({
      message: t('pdfCreationError'),
      intent: 'danger',
    })
  } else if (error instanceof CsvError) {
    appToaster.show({
      message: t('csvCreationError'),
      intent: 'danger',
    })
  } else {
    appToaster.show({
      message: t('unknownError'),
      intent: 'danger',
    })
    reportErrorToSentry(error)
  }
}
