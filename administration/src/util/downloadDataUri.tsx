/**
 * Creates an anchor element `<a></a>` with
 * the base64 source uri and a filename with the
 * HTML5 `download` attribute then clicks on it.
 */
import isIE11 from "./isIE11";

function downloadDataUri(blob: Blob, fileName: string) {
    if (!isIE11()) {
        const data = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = data;
        downloadLink.download = fileName;
        downloadLink.click();
    } else {
        window.navigator.msSaveBlob(blob, fileName)
    }
}

export default downloadDataUri
