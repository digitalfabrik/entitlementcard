const uint8ArrayToPaddedBase64 = function (u8: Uint8Array) {
  return btoa(
    Array.from(u8.values())
      .map(value => String.fromCharCode(value))
      .join('')
  )
}

export default uint8ArrayToPaddedBase64
