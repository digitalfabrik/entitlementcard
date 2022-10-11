import isIE11 from './isIE11'

const getRandomValues = (randomBytes: Uint8Array) => {
  if (!isIE11()) crypto.getRandomValues(randomBytes)
  // @ts-ignore
  else msCrypto.getRandomValues(randomBytes)
}

export default getRandomValues
