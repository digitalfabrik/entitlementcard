import { ApolloError } from '@apollo/client'

import type { GraphQLErrorMessage } from './getMessageFromApolloError'

const defaultErrorMap = (error: ApolloError): GraphQLErrorMessage => {
  if (error.message.includes('401')) {
    return { title: 'Nicht autorisiert' }
  }
  if (error.message.includes('403')) {
    return { title: 'Fehlende Berechtigung' }
  }
  if (error.message.includes('404')) {
    return { title: 'Seite nicht gefunden' }
  }
  if (error.message.includes('500')) {
    return { title: 'Interner Fehler aufgetreten' }
  }
  if (error.message.includes('501')) {
    return { title: 'Funktion nicht verfügbar' }
  }
  return { title: 'Server nicht erreichbar' }
}

export default defaultErrorMap
