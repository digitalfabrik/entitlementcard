# Creating Hashes for Koblenz Pass Data

## Steps

The example data is

| Parameter    | Value         |
|--------------|---------------|
| Geburtstag   | 10.06.2003    |
| Aktenzeichen | 123K          |


### 1. Collect all data and merge it into an object
```agsl
//Example:
{
    birthday: 12213
    referenceNumber: "123K"
}
```

- The birthday is defined in our protobuf [card.proto](../frontend/card.proto) file: It counts the days since the birthday (calculated from 1970-01-01).
  All values of this field are valid, including the 0, which indicates that the birthday is on 1970-01-01. Birthdays before 1970-01-01 have negative values.
- referenceNumber is set to the "Aktenzeichen"


### 2. Convert this object to a Canonical Json
 Result should be:
 ```
 {"1":12213,"2":"123K"}
 ```

### 3. Hash it with Argon2id

Hash with Argon2id with the following parameters:

| Parameter    | Value                                                                          |
|--------------|--------------------------------------------------------------------------------|
| Version      | 19                                                                             | 
| Iterations   | 2                                                                              | 
| Parallellism | 1                                                                              | 
| Memory       | 19456 (19MiB)                                                                  | 
| HashLength   | 32                                                                             | 
| Salt         | Secret Salt will be shared with Koblenz<br/>for the example use `123456789ABC` | 


### 4. The result...
...for the example data and example salt must be (output in encoded form with salt removed):

`$argon2id$v=19$m=19456,t=2,p=1$cr3lP9IMUKNz4BLfPGlAOHq1z98G5/2tTbhDIko35tY`

## Additional Information

- Online Argon2 hasher: https://argon2.online/
- CanonicalJson creation is done in: [CanonicalJson.kt](../backend/src/main/kotlin/app/ehrenamtskarte/backend/cards/CanonicalJson.kt)
- Hashing is done in: [Argon2IdHasher.kt](../backend/src/main/kotlin/app/ehrenamtskarte/backend/cards/Argon2IdHasher.kt)
