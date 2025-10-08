import { ApolloError } from '@apollo/client'
import React from 'react'

import { AppSnackbar } from '../../AppSnackbar'
import { CsvError } from '../../cards/CsvFactory'
import { PdfError } from '../../cards/PdfFactory'
import { CreateCardsError } from '../../cards/createCards'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import i18next from '../../i18n'
import FormAlert from '../../mui-modules/base/FormAlert'
import { reportErrorToSentry } from '../../util/sentry'

export const showCardGenerationError = (appSnackbar: AppSnackbar, error: unknown): void => {
  if (error instanceof CreateCardsError) {
    appSnackbar.enqueueError(error.message)
  } else if (error instanceof ApolloError) {
    const { title } = getMessageFromApolloError(error)
    appSnackbar.enqueueError(<FormAlert isToast errorMessage={title} />, { autoHideDuration: 8000 })
  } else if (error instanceof PdfError) {
    appSnackbar.enqueueError(i18next.t('errors:pdfCreationError'))
  } else if (error instanceof CsvError) {
    appSnackbar.enqueueError(i18next.t('errors:csvCreationError'))
  } else {
    appSnackbar.enqueueError(i18next.t('errors:unknownError'))
    reportErrorToSentry(error)
  }
}
