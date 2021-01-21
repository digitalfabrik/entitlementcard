import {CardActivateModel} from "../generated/compiled";

const generateCardActivateModel = (fullName: string, region: number, expirationDate: Date, cardType: CardActivateModel.CardType) => {
    const randomBytes = new Uint8Array(16); // 128 bit randomness
    crypto.getRandomValues(randomBytes)

    // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
    // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
    // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random)
    const totpSecret = new Uint8Array(20);
    crypto.getRandomValues(totpSecret)

    return new CardActivateModel({
        fullName: fullName,
        randomBytes: randomBytes,
        totpSecret: totpSecret,
        expirationDate: Math.round(expirationDate.getTime() / 1000),
        cardType: cardType,
        region: region,
    })
}

const toBase64 = function (u8: Uint8Array) {
    return btoa(Array.from(u8.values()).map(value => String.fromCharCode(value)).join(''));
}

export const createBinaryData = (fullName: string, region: number, expirationDate: Date, cardType: CardActivateModel.CardType) => {
    const model = generateCardActivateModel(fullName, region, expirationDate, cardType);
    const buffer = CardActivateModel.encode(model).finish();
    return toBase64(buffer)
}
