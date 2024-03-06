# Card Lifecycle

A Berechtigungskarte goes through multiple steps/encodings from adminstration to backend to frontend. This document
shall describe the journey of a card.

## What is the cardInfoHash?

The `CardInfo` consists of the name, expiration day (relative to 01-01-1970) and card extensions (e.g. region extension,
birthday extension, etc.)
The `cardInfoHash` is constructed from the `CardInfo`:

CardInfo => CanonicalJson => String => UTF8-ByteArray

UTF8-ByteArray + Pepper ==HmacSha256==> CardInfoHash

The resulting `cardInfoHash` is then *stored* in our database.
There is no way to "decode" a `cardInfoHash`.
[Hmac Sha256](https://www.rfc-editor.org/rfc/rfc2104) is a one way hashing function.
This way we don't store user data on our server.

## How are the QR-Codes constructed?

We define the QR-Code structure in our [protobuf](../specs/card.proto).
Currently, there are three types of QR-Codes:

- `DynamicActivationCode`: Used to *activate* a card
    - `CardInfo` + `pepper`: Used to create cardInfoHash
    - `activation_secret`: Used to verify validity of qrcode
- `DynamicVerificationCode`: Used to *verify* a card
    - `CardInfo` + `pepper`: Used to create cardInfoHash
- `StaticVerificationCode`: Used for paper cards (requires no otp; is not visible in app)
    - `CardInfo` + `pepper`: Used to create cardInfoHash

To construct a QR-Code we generate the QR-Code protobuf and convert it to binary. This binary is then converted to a
QR-Code Matrix using an adjusted [zxing (Zebra Crossing)](https://github.com/zxing/zxing) implementation (as they don't
support binary QR-Code content).

## Creating a card

![Create cards flow](./img/create_cards_lifecycle.svg)

- The green fields are omitted for Static/Paper cards
- The fields with the pink border can also be executed in the administration frontend instead of the backend.

## Activating a card

![Activate card flow](./img/verify_cards_lifecycle.svg)

> [!Note]
> This is a simplified representation of the card activation.
> It omits how the frontend handles error cases and how we handle already activated cards. 