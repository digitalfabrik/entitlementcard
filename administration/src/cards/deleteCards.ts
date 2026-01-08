import { ApolloError } from '@apollo/client'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { DeleteCardsMutationFn } from '../generated/graphql'
import { CreateCardsError, CreateCardsResult } from './createCards'

const extractCardInfoHashes = (codes: CreateCardsResult[]) =>
  codes.flatMap(({ dynamicCardInfoHashBase64, staticCardInfoHashBase64 }) =>
    staticCardInfoHashBase64
      ? [dynamicCardInfoHashBase64, staticCardInfoHashBase64]
      : dynamicCardInfoHashBase64,
  )

const deleteCards = async (
  deleteCardsMutation: DeleteCardsMutationFn,
  regionId: number,
  codes: CreateCardsResult[],
): Promise<void> => {
  const result = await deleteCardsMutation({
    variables: { regionId, cardInfoHashBase64List: extractCardInfoHashes(codes) },
  })
  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
    throw new CreateCardsError(title)
  }
}

export default deleteCards
