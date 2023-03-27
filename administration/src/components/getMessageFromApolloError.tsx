import { ApolloError } from '@apollo/client'
import { ReactNode } from 'react'

type GraphQLErrorMessage = {
  title: string
  description?: string | ReactNode
}
const getMessageFromApolloError = (error: ApolloError): GraphQLErrorMessage => {
  const defaultMessage = 'Etwas ist schief gelaufen.'
  const codesEqual = error.graphQLErrors.every(
    (value, index, array) => value.extensions.code === array[0].extensions.code
  )
  if (error.graphQLErrors.length !== 1 && !codesEqual) {
    return { title: defaultMessage }
  }

  const graphQLError = error.graphQLErrors[0]
  if ('code' in graphQLError.extensions) {
    switch (graphQLError.extensions['code']) {
      case 'EMAIL_ALREADY_EXISTS':
        return { title: 'Die Email-Adresse wird bereits verwendet.' }
      case 'PASSWORD_RESET_KEY_EXPIRED':
        return {
          title: 'Die Gültigkeit ihres Links ist abgelaufen',
          description: (
            <>
              Unter folgendem Link können Sie Ihr Passwort erneut zurücksetzen und erhalten einen neuen Link.
              <a href={window.location.origin + '/forgot-password'} target='_blank' rel='noreferrer'>
                {window.location.origin + '/forgot-password'}
              </a>
            </>
          ),
        }
      case 'INVALID_LINK':
        return {
          title: 'Ihr Link ist ungültig',
          description:
            'Ihr Link konnte nicht korrekt aufgelöst werden. Bitte kopieren Sie den Link manuell aus Ihrer E-Mail.',
        }
    }
  }
  return { title: defaultMessage }
}

export default getMessageFromApolloError
