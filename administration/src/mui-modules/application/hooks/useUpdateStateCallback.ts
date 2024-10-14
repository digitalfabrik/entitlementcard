import { useCallback } from 'react'

export type Update<T> = (oldState: T) => T

export type SetState<T> = (update: Update<T>) => void

export const useUpdateStateCallback = <T, S extends keyof T>(setState: SetState<T>, key: S): SetState<T[S]> =>
  useCallback(update => setState(state => ({ ...state, [key]: update(state[key]) })), [setState, key])
