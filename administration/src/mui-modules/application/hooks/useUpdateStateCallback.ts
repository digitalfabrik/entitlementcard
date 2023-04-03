import { useCallback } from 'react'

export type Update<T> = (oldState: T) => T

export type SetState<T> = (update: Update<T>) => void

export function useUpdateStateCallback<T, S extends keyof T>(setState: SetState<T>, key: S): SetState<T[S]> {
  return useCallback(update => setState(state => ({ ...state, [key]: update(state[key]) })), [setState, key])
}
