import { useEffect, useState } from 'react'

const usePrintApplication = (): {
  applicationIdForPrint: number | null
  printApplicationById: (id: number) => void
} => {
  const [applicationIdForPrint, setApplicationIdForPrint] = useState<number | null>(null)

  // Before calling window.print, we have to wait for the state (applicationIdForPrint) being propagated in case any
  // layout still needs to change.
  // This is done by calling window.print inside a useEffect handler:
  useEffect(() => {
    if (applicationIdForPrint !== null) {
      window.print()
      // window.print blocks until the print dialog is closed.
      setApplicationIdForPrint(null)
    }
  }, [applicationIdForPrint])

  return {
    applicationIdForPrint,
    printApplicationById: setApplicationIdForPrint,
  }
}

export default usePrintApplication
