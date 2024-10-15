/**
 * Creates an anchor element `<a></a>` with
 * the base64 source uri and a filename with the
 * HTML5 `download` attribute then clicks on it.
 */

const downloadDataUri = (blob: Blob, fileName: string): void => {
  const data = window.URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.href = data
  downloadLink.download = fileName
  downloadLink.click()
}

export default downloadDataUri
