import localforage from 'localforage'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SetState, useUpdateStateCallback } from './useUpdateStateCallback'

const useLocallyStoredState = <T>(
  initialState: T,
  storageKey: string,
): {
  status: 'loading' | 'ready'
  state: T
  setState: SetState<T>
} => {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')

  useEffect(() => {
    localforage
      .getItem<T>(storageKey)
      .then(storedValue => {
        if (storedValue !== null) {
          stateRef.current = storedValue
          setState(storedValue)
        }
      })
      .finally(() => setStatus('ready'))
  }, [storageKey, setState, stateRef])

  const setStateAndRef = useCallback(
    (update: (oldState: T) => T) => {
      if (status !== 'loading') {
        setState(state => {
          const newState = update(state)
          stateRef.current = newState
          return newState
        })
      }
    },
    [status],
  )

  useEffect(() => {
    // Auto-save every 2 seconds unless we're still loading the state.
    if (status === 'loading') {
      return () => undefined
    }
    let lastState: T | null = null
    const interval = setInterval(() => {
      if (lastState !== stateRef.current) {
        localforage.setItem(storageKey, stateRef.current)
        lastState = stateRef.current
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [status, storageKey])

  return { status, state, setState: setStateAndRef }
}

/**
 * Locally stores some state together with a version using localforage.
 * Auto-saves any update every 2 seconds.
 * Initially, it
 *  - returns the locally stored state, if there exists one and if the stored version matches the passed version, or
 *  - returns the passed initial state otherwise.
 *  While localforage is loading, the returned status is set to `loading` otherwise to `ready`.
 */
const useVersionedLocallyStoredState = <T>(
  initialState: T,
  storageKey: string,
  version: string,
): {
  status: 'loading' | 'ready'
  state: T
  setState: SetState<T>
} => {
  const {
    status: locallyStoredStatus,
    setState: setLocallyStoredState,
    state: locallyStoredState,
  } = useLocallyStoredState({ version, value: initialState }, storageKey)
  const locallyStoredVersion =
    typeof locallyStoredState === 'object' && 'version' in locallyStoredState
      ? locallyStoredState.version
      : '(could not determine)'
  useEffect(() => {
    if (locallyStoredStatus === 'ready' && locallyStoredVersion !== version) {
      console.warn(
        `Resetting storage because of version mismatch: \n` +
          `Locally stored version: ${locallyStoredVersion}.\n` +
          `New version: ${version}.`,
      )
      setLocallyStoredState(() => ({ version, value: initialState }))
    }
  }, [locallyStoredVersion, version, locallyStoredStatus, initialState, setLocallyStoredState])
  const setState: SetState<T> = useUpdateStateCallback(setLocallyStoredState, 'value')
  if (locallyStoredStatus === 'loading' || locallyStoredVersion !== version) {
    return {
      status: 'loading',
      state: initialState,
      setState,
    }
  }
  return { status: 'ready', state: locallyStoredState.value, setState }
}

export default useVersionedLocallyStoredState
