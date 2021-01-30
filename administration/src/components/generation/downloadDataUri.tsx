/**
 * Creates an anchor element `<a></a>` with
 * the base64 source uri and a filename with the
 * HTML5 `download` attribute then clicks on it.
 */
function downloadDataUri(uri: string, fileName: string) {
    const downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = fileName;
    downloadLink.click();
}

export default downloadDataUri
