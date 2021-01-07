/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IdsParamsInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: AcceptingStoreSummaryById
// ====================================================

export interface AcceptingStoreSummaryById_physicalStoresById_store {
  __typename: "AcceptingStore";
  name: string | null;
  description: string | null;
}

export interface AcceptingStoreSummaryById_physicalStoresById {
  __typename: "PhysicalStore";
  id: number;
  store: AcceptingStoreSummaryById_physicalStoresById_store;
}

export interface AcceptingStoreSummaryById {
  /**
   * Returns list of all accepting stores queried by ids.
   */
  physicalStoresById: AcceptingStoreSummaryById_physicalStoresById[];
}

export interface AcceptingStoreSummaryByIdVariables {
  ids: IdsParamsInput;
}
