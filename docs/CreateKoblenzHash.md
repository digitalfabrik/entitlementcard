# Creating Hashes for Koblenz Pass Data

## Steps

The example data is

| Parameter    | Value         |
|--------------|---------------|
| Name         | Karla Koblenz |
| Geburtstag   | 10.06.2003    |
| Aktenzeichen | 123K          |


### 1. Collect all data and merge it into an object
```agsl
//Example:
{
    full_name: "Karla Koblenz"
    birthday: 12213
    referenceNumber: "123K"
}
```

- The full_name must be `FirstnameSpaceLastname`. Every char must exaclty match the user input, as otherwise there is not possiblity to match the data Koblenz transfers with the input the user makes.
e.g. `Karla Koblenz` will match neither with `Karla Lisa Koblenz` nor with `Karlá Koblenz`.
- The birthday is defined in our protobuf [card.proto](../frontend/card.proto) file: It counts the days since the birthday (calculated from 1970-01-01).
  All values of this field are valid, including the 0, which indicates that the birthday is on 1970-01-01. Birthdays before 1970-01-01 have negative values.
- referenceNumber is set to the "Aktenzeichen"


### 2. Convert this object to a Canonical Json
 Result should be:
 ```
 {"1":"Karla Koblenz","2":12213,"3":"123K"}
 ```

### 3. Hash it with Argon2id

Hash with Argon2id with the following parameters:

| Parameter    | Value                                                                          |
|--------------|--------------------------------------------------------------------------------|
| Version      | 19                                                                             | 
| Iterations   | 2                                                                              | 
| Parallellism | 1                                                                              | 
| Memory       | 16                                                                             | 
| HashLength   | 32                                                                             | 
| Salt         | Secret Salt will be shared with Koblenz<br/>for the example use `123456789ABC` | 


### 4. The result...
...for the example data and example salt must be:

`$argon2id$v=19$m=16,t=2,p=1$MTIzNDU2Nzg5QUJD$UIOJZIsSL8vXcuCB82xZ5E8tpH6sQd3d4U0uC02DP40`


## Additional Information

- Online Argon2 hasher: https://argon2.online/
- CanonicalJson creation is done in: [CanonicalJson.kt](../backend/src/main/kotlin/app/ehrenamtskarte/backend/verification/CanonicalJson.kt)
- Hashing is done in: [Argon2IdHasher.kt](../backend/src/main/kotlin/app/ehrenamtskarte/backend/verification/Argon2IdHasher.kt)

