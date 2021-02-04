import isIE11 from "./isIE11";

const getRandomValues = (randomBytes: Uint8Array) => {
    if (!isIE11())
        crypto.getRandomValues(randomBytes)
    else // @ts-ignore
        msCrypto.getRandomValues(randomBytes)
}


export default getRandomValues
