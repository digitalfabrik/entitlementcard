import { useEffect, useState } from 'react'

const usePrintMode = (): { printApplicationId: number | null; setPrintApplicationId: (id: number) => void } => {
  const [printApplicationId, setPrintApplicationId] = useState<number | null>(null)

  useEffect(() => {
    if (printApplicationId) {
      window.print()
    }
  }, [printApplicationId])

  // By closing the print window the print applicationId has to be reset
  useEffect(() => {
    const disablePrintMode = () => {
      setPrintApplicationId(null)
    }
    window.addEventListener('afterprint', disablePrintMode)
    return () => window.removeEventListener('afterprint', disablePrintMode)
  }, [])
  return {
    printApplicationId,
    setPrintApplicationId,
  }
}

export default usePrintMode
