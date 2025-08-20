import { ApolloError } from '@apollo/client'

import i18next from '../i18n'
import type { GraphQLErrorMessage } from './getMessageFromApolloError'

const defaultErrorMap = (error: ApolloError): GraphQLErrorMessage => {
  if (error.message.includes('401')) {
    return { title: i18next.t('errors:notAuthorized') }
  }
  if (error.message.includes('403')) {
    return { title: i18next.t('errors:notAuthorized') }
  }
  if (error.message.includes('404')) {
    return { title: i18next.t('errors:pageNotFound') }
  }
  if (error.message.includes('500')) {
    return { title: i18next.t('errors:internalError') }
  }
  if (error.message.includes('501')) {
    return { title: i18next.t('errors:functionNotAvailable') }
  }
  return { title: i18next.t('errors:serverNotAvailable'), retryable: true }
}

export default defaultErrorMap
