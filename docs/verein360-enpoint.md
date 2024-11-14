# Verein360 Endpoint Documentation

## Introduction
Verein360/BLSV should be able to send already approved entitlementcard application for their trainers.
An api token that can be generated from the "Digitale Druckerei" account is required to access the endpoint.
All details about the endpoint can be found in the [API Documentation](../specs/backend-api.graphql).

## Usage

### Set Authourization Header

Set the HTTP header `Authorization Bearer <api-token>` to access the endpoint.

### Call GraphQL Mutation to add an application

```graphql
mutation addEakApplication($regionId: Int!, $application: ApplicationInput!, $project: String!) {
  result: addEakApplication(regionId: $regionId, application: $application, project: $project)
}
```

### Sample Mutation Variables

```json
  {
  "regionId": 2,                                      // Must be the correct region ID where the card owner lives
  "application": {
    "applicationDetails": {
      "applicationType": "FIRST_APPLICATION",         // Must be FIRST_APPLICATION
      "cardType": "BLUE",                             // Must be BLUE
      "givenInformationIsCorrectAndComplete": true,   // Must be true
      "hasAcceptedEmailUsage": true,                  // true or false
      "hasAcceptedPrivacyPolicy": true,               // Must be true
      "wantsDigitalCard": true,                       // Must be true
      "wantsPhysicalCard": false,                     // Must be false
      "blueCardEntitlement": {
        "entitlementType": "WORK_AT_ORGANIZATIONS",   // Must be WORK_AT_ORGANIZATIONS
        "workAtOrganizationsEntitlement": {
          "list": {
            "amountOfWork": 7.5,
            "organization": {
              "address": {
                "country": {
                  "shortText": "Germany"
                },
                "houseNumber": {
                  "shortText": "123"
                },
                "location": {
                  "shortText": "Munich"
                },
                "postalCode": {
                  "shortText": "80331"
                },
                "street": {
                  "shortText": "Example Street"
                }
              },
              "category": {"shortText": "Sport"},     // Must be Sport
              "contact": {
                "email": {"email": "jane.doe@sportverein.de"},
                "hasGivenPermission": true,           // Must be true
                "name": {"shortText": "Jane Doe"},
                "telephone": {"shortText": "0150123456789"}
              },
              "name": {
                "shortText": "Sportverein Augsburg-Nord"
              }
            },
            "payment": false,                         // Must be false
            "responsibility": {"shortText": "Trainer"},
            "workSinceDate": {"date": "2020-10-06"},
            "isAlreadyVerified": true                 // Must be true, so that we can mark the application as verified. 
                                                      // If this is set to true, but not valid application token is set 
                                                      // the application is rejected and an error code returned.
          }
        }
      }
    },
    "personalData": {
      "address": {
        "country": {
          "shortText": "Germany"
        },
        "houseNumber": {
          "shortText": "123"
        },
        "location": {
          "shortText": "Munich"
        },
        "postalCode": {
          "shortText": "80331"
        },
        "street": {
          "shortText": "Example Street"
        }
      },
      "dateOfBirth": {
        "date": "1990-01-01"
      },
      "emailAddress": {
        "email": "johndoe@example.com"
      },
      "forenames": {
        "shortText": "John"
      },
      "surname": {
        "shortText": "Doe"
      },
      "telephone": {
        "shortText": "123456789"
      }
    }
  },
  "project": "bayern.ehrenamtskarte.app"              // Must be bayern.ehrenamtskarte.app  
}
```


### Get Region ID for application

#### Get all Regions

The region ID can be obtained by calling the following query:
```graphql
query getRegions($project: String!) {
  regions: regionsInProject(project: $project) {
    id
    prefix
    name
  }
}
```
Variables
```json
{
  "project": "bayern.ehrenamtskarte.app"
}
```

#### Get Region By Postal Code

```graphql
query getRegionsByPostalCode($postalCode: String!, $project: String!) {
  regions: regionsByPostalCode(postalCode: $postalCode, project: $project) {
    id
    name
    prefix
  }
}
```

```json
{
  "postalCode": "86152",
  "project": "bayern.ehrenamtskarte.app"
}
```
