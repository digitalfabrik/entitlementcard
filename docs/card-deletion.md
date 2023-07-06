# Revoking a card

Sometimes it might occur that cards have to be deleted. 

There are two cases to consider: 
- revoke with pdf
- revoke without pdf

## Revoke with pdf

1. With the development app scan the activation code (do not overwrite existing card)
2. Get the `cardInfoHash` from the server logs
3. Convert the encoded `cardInfoHash` into a byte array (https://cryptii.com/pipes/base64-to-hex)
4. In the database query for the card:
```sql
select * from "cards"
where "cardInfoHash" =decode('b7c9af18c9c855a5fcf84d776c43593be783b8f94286589e14849f97368b2fb0', 'hex');
```

5. Verify that there is only one result (for the very unlikely situation that the specific hash is not unique).
   If there is more than one result repeat the steps 2-4 with the `activationSecretHash`.
6. Revoke the card in the database:
```sql
update "cards"
set "revoked" = true
where "cardInfoHash" = decode('b7c9af18c9c855a5fcf84d776c43593be783b8f94286589e14849f97368b2fb0', 'hex')
```

7. (only wit static card) If the corresponding project also uses static cards, the corresponding static card also needs to be revoked. 
8. (only wit static card) For that verify the static QRCode.
9. (only wit static card) Then repeat steps 2-6

## revoke without pdf

Without the pdf and only some meta information our options are very limited. 
You can try to search for cards by (1) first activation date or by (2) expiration date and by (3) region. 
E.g. 
(1) the card was never activated
(2) expires on the 12.12.2026
(3) from region "Augsburg Stadt"

1. Convert the (2) to days since 01.01.1970 -> 20799
2. Look up regionId (you could also include this in 3) -> 9
3. Select all cards that match
```sql
select * from "cards"
where "firstActivationDate" = null
and "expirationDay" = 20799
and "regionId" = 9;
```
4. If there *is* exactly one result (or two results, one with code type static and one with code type dynamic),
   then the card can be revoked. Otherwise there is no possibility to delete this card atm.