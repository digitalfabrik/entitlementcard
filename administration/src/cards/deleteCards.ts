import { UseMutationExecute } from 'urql'

import { messageFromGraphQlError } from '../errors'
import { DeleteCardsMutation, DeleteCardsMutationVariables } from '../graphql'
import { CreateCardsError, CreateCardsResult } from './createCards'

export type DeleteCardsMutationFn = UseMutationExecute<
  DeleteCardsMutation,
  DeleteCardsMutationVariables
>

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
    regionId,
    cardInfoHashBase64List: extractCardInfoHashes(codes),
  })
  if (result.error) {
    const { title } = messageFromGraphQlError(result.error)
    throw new CreateCardsError(title)
  }
}

export default deleteCards
