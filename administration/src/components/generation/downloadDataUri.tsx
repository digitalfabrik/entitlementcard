/**
 * Creates an anchor element `<a></a>` with
 * the base64 source uri and a filename with the
 * HTML5 `download` attribute then clicks on it.
 */
import isIE11 from "../../util/isIE11";

function downloadDataUri(blob: Blob, fileName: string) {
    const newBlob = new Blob([blob], {type: "application/pdf"})
    if (!isIE11()) {
        const data = window.URL.createObjectURL(newBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = data;
        downloadLink.download = fileName;
        downloadLink.click();
    } else {
        window.navigator.msSaveBlob(newBlob, fileName)
    }
}

export default downloadDataUri
