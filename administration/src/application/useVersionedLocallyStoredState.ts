import localforage from 'localforage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SetState } from './useUpdateStateCallback'

function useLocallyStoredState<T>(initialState: T, storageKey: string): [T | null, SetState<T>] {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  const [loading, setLoading] = useState(true)

  const setStateAndRef = useCallback((update: (oldState: T) => T) => {
    setState(state => {
      const newState = update(state)
      stateRef.current = newState
      return newState
    })
  }, [])

  useEffect(() => {
    localforage
      .getItem<T>(storageKey)
      .then(storedValue => {
        if (storedValue !== null) {
          setStateAndRef(() => storedValue)
        }
      })
      .finally(() => setLoading(false))
  }, [storageKey, setStateAndRef])

  useEffect(() => {
    // Auto-save every 2 seconds unless we're still loading the state.
    if (loading) {
      return
    }
    let lastState: T | null = null
    const interval = setInterval(() => {
      if (lastState !== stateRef.current) {
        localforage.setItem(storageKey, stateRef.current)
        lastState = stateRef.current
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [loading, storageKey])

  return [loading ? null : state, setStateAndRef]
}

export default useLocallyStoredState
