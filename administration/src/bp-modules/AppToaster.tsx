import { OverlayToaster, Position, Toaster } from '@blueprintjs/core'
import React, { ReactElement, ReactNode, createContext, useContext, useState } from 'react'
import styled from 'styled-components'

const ToasterContext = createContext<Toaster | null>(null)

export const useAppToaster = (): Toaster | null => useContext(ToasterContext)

const StyledOverlayToaster = styled(OverlayToaster)`
  z-index: 9999;
`

export const AppToasterProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [toaster, setToaster] = useState<OverlayToaster | null>(null)
  return (
    <ToasterContext.Provider value={toaster}>
      <StyledOverlayToaster ref={setToaster} position={Position.TOP} />
      {children}
    </ToasterContext.Provider>
  )
}
