import {Position, Toaster} from "@blueprintjs/core";
import {createContext, ReactElement, useContext, useState} from "react";

const ToasterContext = createContext<Toaster | null>(null)

export const useAppToaster = (): Toaster | null => useContext(ToasterContext)

export const AppToasterProvider = (props: { children: ReactElement }) => {
    const [toaster, setToaster] = useState<Toaster | null>(null)
    return <ToasterContext.Provider value={toaster}>
        <Toaster ref={setToaster} position={Position.TOP}/>
        {props.children}
    </ToasterContext.Provider>
}
