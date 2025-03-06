import { ApolloError } from '@apollo/client'
import { TFunction } from 'i18next'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { DeleteCardsMutationFn } from '../generated/graphql'
import { CreateCardsError, CreateCardsResult } from './createCards'

const extractCardInfoHashes = (codes: CreateCardsResult[]) =>
  codes.flatMap(({ dynamicCardInfoHashBase64, staticCardInfoHashBase64 }) =>
    staticCardInfoHashBase64 ? [dynamicCardInfoHashBase64, staticCardInfoHashBase64] : dynamicCardInfoHashBase64
  )

const deleteCards = async (
  deleteCardsService: DeleteCardsMutationFn,
  regionId: number,
  codes: CreateCardsResult[],
  t: TFunction
): Promise<void> => {
  const result = await deleteCardsService({
    variables: { regionId, cardInfoHashBase64List: extractCardInfoHashes(codes) },
  })
  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }), t)
    throw new CreateCardsError(title)
  }
}

export default deleteCards
