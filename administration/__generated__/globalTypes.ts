/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AuthDataInput {
  email: string;
  password: string;
}

export interface CardGenerationModelInput {
  cardDetailsHashBase64: string;
  expirationDate: GQL_Long;
  regionId: number;
  totpSecretBase64: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
