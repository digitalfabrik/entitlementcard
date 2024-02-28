# Card Lifecycle

A Berechtigungskarte goes through multiple steps/encodings from adminstration to backend to frontend. This document
shall describe the journey of a card.

## Creating a card

![Create cards flow](./img/create_cards_lifecycle.svg)

- The green fields are omitted for Static/Paper cards
- The fields with the pink border can also be executed in the administration frontend instead of the backend.

## Activating a card

![Activate card flow](./img/verify_cards_lifecycle.svg)

> [!Note]
> This is a simplified representation of the card activation. 
> It omits how the frontend handles error cases and how we handle already activated cards. 