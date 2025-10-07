import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

const useNavigateWithCallback = (callback: () => void): ((path: string) => void) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [navigating, setNavigating] = useState(false)
  const [initialPath, setInitialPath] = useState(location.pathname)

  useEffect(() => {
    if (navigating && location.pathname !== initialPath) {
      callback()
      setNavigating(false)
    }
  }, [location, navigating, callback, initialPath])

  return (path: string) => {
    setInitialPath(location.pathname)
    setNavigating(true)
    navigate(path)
  }
}

export default useNavigateWithCallback
