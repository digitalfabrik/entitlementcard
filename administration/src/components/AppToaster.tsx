import {Position, Toaster} from "@blueprintjs/core";
import {createRoot} from "react-dom/client";

/** Singleton toaster instance. Create separate instances for different options. */
let toasterRef: Toaster | null
createRoot(document.getElementById("toaster")!).render(
    <Toaster ref={ref => {
        toasterRef = ref
    }} position={Position.TOP}/>
)
export const getAppToaster = () => {
    return toasterRef!
}
