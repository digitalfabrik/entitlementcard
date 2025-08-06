import { ApolloError } from '@apollo/client'
import { Toaster } from '@blueprintjs/core'
import React from 'react'

import { CsvError } from '../../cards/CsvFactory'
import { PdfError } from '../../cards/PdfFactory'
import { CreateCardsError } from '../../cards/createCards'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import i18next from '../../i18n'
import FormAlert from '../../mui-modules/base/FormAlert'
import { reportErrorToSentry } from '../../util/sentry'

export const showCardGenerationError = (appToaster: Toaster, error: unknown): void => {
  if (error instanceof CreateCardsError) {
    appToaster.show({
      message: error.message,
      intent: 'danger',
    })
  } else if (error instanceof ApolloError) {
    const { title } = getMessageFromApolloError(error)
    appToaster.show({
      message: <FormAlert isToast errorMessage={title} />,
      timeout: 8000,
      intent: 'danger',
    })
  } else if (error instanceof PdfError) {
    appToaster.show({
      message: i18next.t('errors:pdfCreationError'),
      intent: 'danger',
    })
  } else if (error instanceof CsvError) {
    appToaster.show({
      message: i18next.t('errors:csvCreationError'),
      intent: 'danger',
    })
  } else {
    appToaster.show({
      message: i18next.t('errors:unknownError'),
      intent: 'danger',
    })
    reportErrorToSentry(error)
  }
}
