import { OverlayToaster, Position, Toaster } from '@blueprintjs/core'
import React, { ReactElement, ReactNode, createContext, useContext, useState } from 'react'

const ToasterContext = createContext<Toaster | null>(null)

export const useAppToaster = (): Toaster | null => useContext(ToasterContext)

export const AppToasterProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [toaster, setToaster] = useState<OverlayToaster | null>(null)
  return (
    <ToasterContext.Provider value={toaster}>
      <OverlayToaster ref={setToaster} position={Position.TOP} />
      {children}
    </ToasterContext.Provider>
  )
}
