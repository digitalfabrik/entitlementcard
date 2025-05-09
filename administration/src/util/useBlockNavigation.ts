import { useEffect } from 'react'
import { unstable_usePrompt as unstableUsePrompt } from 'react-router'

const useBlockNavigation = ({ when, message }: { when: boolean; message: string }): void => {
  unstableUsePrompt({ when, message })
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
  }, [when, message])
}

export default useBlockNavigation
