import { ApolloError } from '@apollo/client'
import { EnqueueSnackbar } from 'notistack'
import React from 'react'

import FormAlert from '../components/FormAlert'
import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import i18next from '../translations/i18n'
import { reportErrorToSentry } from '../util/sentry'
import { CreateCardsError } from './createCards'
import { CsvError } from './csvFactory'
import { PdfError } from './pdf/pdfFactory'

export const showCardGenerationError = (enqueueSnackbar: EnqueueSnackbar, error: unknown): void => {
  if (error instanceof CreateCardsError) {
    enqueueSnackbar(error.message, { variant: 'error' })
  } else if (error instanceof ApolloError) {
    const { title } = getMessageFromApolloError(error)
    enqueueSnackbar(<FormAlert isToast errorMessage={title} />, {
      variant: 'error',
      autoHideDuration: 8000,
    })
  } else if (error instanceof PdfError) {
    enqueueSnackbar(i18next.t('errors:pdfCreationError'), { variant: 'error' })
  } else if (error instanceof CsvError) {
    enqueueSnackbar(i18next.t('errors:csvCreationError'), { variant: 'error' })
  } else {
    enqueueSnackbar(i18next.t('errors:unknownError'), { variant: 'error' })
    reportErrorToSentry(error)
  }
}
