import { Exchange, makeResult } from 'urql'
import { map, pipe } from 'wonka'

export type MockUrqlResult = { data: Record<string, unknown> }

export const createMockExchange =
  (responses: MockUrqlResult[]): Exchange =>
  () =>
  ops$ =>
    pipe(
      ops$,
      map(op => makeResult(op, responses.shift() ?? { data: null })),
    )
