import {getUnixTime} from "date-fns";
import {CardActivateModel} from "../generated/compiled";
import isIE11 from "./isIE11";

const generateCardActivateModel = (
    fullName: string, region: number, expirationDate: Date, cardType: CardActivateModel.CardType
) => {
    if (!window.isSecureContext && !isIE11()) // localhost is considered secure.
        throw Error("Environment is not considered secure nor are we using Internet Explorer.")
    const randomBytes = new Uint8Array(16); // 128 bit randomness
    crypto.getRandomValues(randomBytes)

    // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
    // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
    // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random)
    const totpSecret = new Uint8Array(20)
    crypto.getRandomValues(totpSecret)

    return new CardActivateModel({
        fullName: fullName,
        randomBytes: randomBytes,
        totpSecret: totpSecret,
        expirationDate: getUnixTime(expirationDate),
        cardType: cardType,
        region: region,
    })
}

export default generateCardActivateModel
