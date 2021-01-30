import {getUnixTime} from "date-fns";
import {CardActivateModel} from "../generated/compiled";
import {detect} from "detect-browser";

const isIE11 = () => {
    const browser = detect()
    return browser?.name === "ie" && browser.version === "11"
}

export default isIE11
