import { useEffect } from 'react'
import { unstable_usePrompt } from 'react-router-dom'

const useBlockNavigation = ({ when, message }: { when: boolean; message: string }) => {
  unstable_usePrompt({ when, message })
  useEffect(() => {
    if (when) {
      const listener = (event: BeforeUnloadEvent) => {
        event.returnValue = message
      }
      window.addEventListener('beforeunload', listener)
      return () => window.removeEventListener('beforeunload', listener)
    }
  }, [when, message])
}

export default useBlockNavigation
