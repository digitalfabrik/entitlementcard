/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {AuthDataInput} from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: signIn
// ====================================================

export interface signIn_signInPayload_user {
  __typename: "Administrator";
  email: string;
}

export interface signIn_signInPayload {
  __typename: "SignInPayload";
  token: string;
  user: signIn_signInPayload_user;
}

export interface signIn {
  /**
   * Signs in an administrator
   */
  signInPayload: signIn_signInPayload;
}

export interface signInVariables {
  authData: AuthDataInput;
}
