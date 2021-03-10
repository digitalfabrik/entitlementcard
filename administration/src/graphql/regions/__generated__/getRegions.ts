/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRegions
// ====================================================

export interface getRegions_regions {
  __typename: "Region";
  id: number;
  prefix: string;
  name: string;
  regionIdentifier: string;
}

export interface getRegions {
  /**
   * Return list of all regions.
   */
  regions: getRegions_regions[];
}
