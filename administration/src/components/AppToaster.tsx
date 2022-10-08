import {Position, Toaster} from "@blueprintjs/core";
import {createContext, ReactElement, useCallback, useContext, useState} from "react";

const ToasterContext = createContext<Toaster | null>(null)

export const useAppToaster = (): Toaster | null => useContext(ToasterContext)

export const AppToasterProvider = (props: { children: ReactElement }) => {
    const [toaster, setToaster] = useState<Toaster | null>(null)
    const toasterRef = useCallback(setToaster, [setToaster])
    return <ToasterContext.Provider value={toaster}>
        <Toaster ref={toasterRef} position={Position.TOP}/>
        {props.children}
    </ToasterContext.Provider>
}
