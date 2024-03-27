import { ApolloClient, ApolloError } from '@apollo/client'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import {
  SendCardCreationConfirmationMailDocument,
  SendCardCreationConfirmationMailMutation,
  SendCardCreationConfirmationMailMutationVariables,
} from '../generated/graphql'

export class SendCardConfirmationMailError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SendCardConfirmationMailError'
  }
}
const sendCardConfirmationMail = async (
  client: ApolloClient<object>,
  project: string,
  recipientAddress: string,
  recipientName: string,
  deepLink: string
): Promise<void> => {
  const result = await client.mutate<
    SendCardCreationConfirmationMailMutation,
    SendCardCreationConfirmationMailMutationVariables
  >({
    mutation: SendCardCreationConfirmationMailDocument,
    variables: { project, recipientAddress, recipientName, deepLink },
  })
  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
    throw new SendCardConfirmationMailError(title)
  }
}

export default sendCardConfirmationMail
