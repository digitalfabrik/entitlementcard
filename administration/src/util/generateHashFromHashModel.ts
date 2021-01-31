import {CardActivateModel} from "../generated/compiled";
import isIE11 from "./isIE11";

export interface HashModel {
    fullName: string,
    region: number,
    randomBytes: Uint8Array,
    cardType: CardActivateModel.CardType,
}

const generateHashFromHashModel = async (hashModel: HashModel) => {
    // todo: replace this routine with a custom encoding for reliable hashes
    // Encode without TextEncoder because of IE11
    const utf8 = unescape(encodeURIComponent(JSON.stringify(hashModel)));
    const encoded = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        encoded[i] = utf8.charCodeAt(i);
    }

    // In IE11, this returns CryptoOperation,
    // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#browser_compatibility
    let hashArrayBuffer: ArrayBuffer
    if (isIE11()) { // @ts-ignore
        hashArrayBuffer = await new Promise((resolve, reject) => { // @ts-ignore
            const operation = window.msCrypto.subtle.digest({ name: "SHA-256", hash: "SHA-256" }, encoded.buffer) // @ts-ignore
            operation.oncomplete = (event) => resolve(event.target.result) // @ts-ignore
            operation.onerror = (e) => reject(e)
        })
    } else {
        hashArrayBuffer = await crypto.subtle.digest("SHA-256", encoded)
    }
    return new Uint8Array(hashArrayBuffer)
}

export default generateHashFromHashModel
