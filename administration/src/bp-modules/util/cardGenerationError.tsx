import { ApolloError } from '@apollo/client'
import { EnqueueSnackbar } from 'notistack'
import React from 'react'

import { CsvError } from '../../cards/CsvFactory'
import { PdfError } from '../../cards/PdfFactory'
import { CreateCardsError } from '../../cards/createCards'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import i18next from '../../i18n'
import FormAlert from '../../mui-modules/base/FormAlert'
import { reportErrorToSentry } from '../../util/sentry'

export const showCardGenerationError = (enqueueSnackbar: EnqueueSnackbar, error: unknown): void => {
  if (error instanceof CreateCardsError) {
    enqueueSnackbar(error.message, { variant: 'error' })
  } else if (error instanceof ApolloError) {
    const { title } = getMessageFromApolloError(error)
    enqueueSnackbar(<FormAlert isToast errorMessage={title} />, { variant: 'error', autoHideDuration: 8000 })
  } else if (error instanceof PdfError) {
    enqueueSnackbar(i18next.t('errors:pdfCreationError'), { variant: 'error' })
  } else if (error instanceof CsvError) {
    enqueueSnackbar(i18next.t('errors:csvCreationError'), { variant: 'error' })
  } else {
    enqueueSnackbar(i18next.t('errors:unknownError'), { variant: 'error' })
    reportErrorToSentry(error)
  }
}
