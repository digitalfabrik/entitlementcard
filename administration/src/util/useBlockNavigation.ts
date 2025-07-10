import { useEffect } from 'react'
import { unstable_usePrompt as unstableUsePrompt } from 'react-router'

const useBlockNavigation = ({ when, message }: { when: boolean; message: string }): void => {
  unstableUsePrompt({
    message,
    // only trigger unstable prompt when the pathname changes and the "when" condition is met
    when: ({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname && when,
  })

  useEffect(() => {
    if (when) {
      const listener = (event: BeforeUnloadEvent) => ({
        ...event,
        returnValue: message,
      })
      window.addEventListener('beforeunload', listener)
      return () => window.removeEventListener('beforeunload', listener)
    }
    return () => undefined
  }, [message, when])
}

export default useBlockNavigation
