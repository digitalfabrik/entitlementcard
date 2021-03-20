/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getApplications
// ====================================================

export interface getApplications_applications {
  __typename: "ApplicationView";
  id: number;
  createdDate: string;
  jsonValue: string;
}

export interface getApplications {
  /**
   * Queries all applications for a specific region
   */
  applications: getApplications_applications[];
}

export interface getApplicationsVariables {
  regionId: number;
}
