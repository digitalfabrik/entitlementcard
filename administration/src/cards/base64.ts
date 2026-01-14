export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string =>
  btoa(
    Array.from(uint8Array.values())
      .map(value => String.fromCharCode(value))
      .join(''),
  )

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64)
  return new Uint8Array([...binaryString].map(char => char.charCodeAt(0)))
}
