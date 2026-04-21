# Card Query Params

The card creation page accepts query parameters to pre-fill card data. Each project supports a different set of parameters.

---

## Ehrenamtskarte Bayern

**Examples**
```
/cards/add?Name=Thea+Test&Ablaufdatum=03.03.2026&Kartentyp=Standard
/cards/add?Name=Thea+Test&Kartentyp=Goldkarte
/cards/add?Name=Thea+Test&Ablaufdatum=03.03.2026&Kartentyp=Standard&EMail=thea@test.de&UserId=12345
```

**Freinet Example**
```
/cards/add?Name=Freinet+User&Ablaufdatum=09.03.2029&UserId=1396940&EMail=test@test.com
```

| Parameter   | Required | Format / Values                    | Description                                              |
|-------------|----------|------------------------------------|----------------------------------------------------------|
| `Name`      | yes      | String                             | Full name of the card holder                             |
| `Ablaufdatum` | no     | `dd.MM.yyyy`                       | Expiry date. Defaults to 3 years from today if omitted   |
| `Kartentyp` | yes      | `Standard`, `Goldkarte`            | Card type. Legacy values `blau` and `gold` are also accepted |
| `EMail`     | no       | Email address                      | Recipient address for the card creation confirmation mail |
| `UserId`    | no       | String                             | Freinet user ID for data synchronisation                 |

---

## Digitaler Nürnberg-Pass

**Examples**
```
/cards/add?Name=Thea+Test&Ablaufdatum=03.03.2026&Geburtsdatum=01.01.2000&Passnummer=12345678&Pass-ID=123
/cards/add?Name=Thea+Test&Ablaufdatum=03.03.2026&Geburtsdatum=01.01.2000&Passnummer=12345678&Pass-ID=123&Adresszeile+1=Teststraße+3
/cards/add?Name=Thea+Test&Ablaufdatum=fehler&Geburtsdatum=fehler&Passnummer=abc&Pass-ID=abc
```

| Parameter      | Required | Format / Values                    | Description                                              |
|----------------|----------|------------------------------------|----------------------------------------------------------|
| `Name`         | yes      | String                             | Full name of the card holder                             |
| `Ablaufdatum`  | yes      | `dd.MM.yyyy`                       | Expiry date                                              |
| `Startdatum`   | yes      | `dd.MM.yyyy`                       | Activation start date. Defaults to today if omitted      |
| `Geburtsdatum` | yes      | `dd.MM.yyyy`                       | Date of birth. Must not be in the future                 |
| `Pass-ID`      | yes      | Integer (max 9 digits)             | Numeric Nürnberg-Pass identifier                         |
| `Passnummer`   | yes      | String                             | Pass number                                              |
| `Adresszeile 1`| no       | String (no special characters)     | Street address line 1                                    |
| `Adresszeile 2`| no       | String (no special characters)     | Street address line 2                                    |
| `PLZ`          | no       | Exactly 5 digits                   | German postal code                                       |
| `Ort`          | no       | String (no special characters)     | City                                                     |

---

## KoblenzPass

**Example**
```
/erstellen?Name=Karla+Koblenz&Referenznummer=123K&Geburtsdatum=10.06.2003
```

| Parameter       | Required | Format / Values                    | Description                                              |
|-----------------|----------|------------------------------------|----------------------------------------------------------|
| `Name`          | yes      | String                             | Full name of the card holder                             |
| `Ablaufdatum`   | no       | `dd.MM.yyyy`                       | Expiry date. Defaults to 1 year from today if omitted    |
| `Geburtsdatum`  | yes      | `dd.MM.yyyy`                       | Date of birth. Must not be in the future                 |
| `Referenznummer`| yes      | String, 4–15 characters            | Reference number for identification. No special characters allowed |
