import { ApolloClient, ApolloError } from '@apollo/client'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { DeleteCardsDocument, DeleteCardsMutation, DeleteCardsMutationVariables } from '../generated/graphql'
import { CreateCardsError } from './createCards'

const deleteCards = async (
  client: ApolloClient<object>,
  regionId: number,
  cardInfoHashesBase64: string[]
): Promise<void> => {
  const result = await client.mutate<DeleteCardsMutation, DeleteCardsMutationVariables>({
    mutation: DeleteCardsDocument,
    variables: { regionId, cardInfoHashBase64List: cardInfoHashesBase64 },
  })
  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
    throw new CreateCardsError(title)
  }
}

export default deleteCards
