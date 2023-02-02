const uint8ArrayToUnpaddedBase64 = function (u8: Uint8Array) {
  return btoa(
    Array.from(u8.values())
      .map(value => String.fromCharCode(value))
      .join('')
  ).replace('=', '')
}

export default uint8ArrayToUnpaddedBase64
