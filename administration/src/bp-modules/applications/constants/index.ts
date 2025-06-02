import { css } from 'styled-components'

export enum ApplicationStatus {
  fullyVerified,
  fullyRejected,
  withdrawed,
  ambiguous,
}

export type ApplicationStatusBarItemType = {
  title: string
  status?: ApplicationStatus
}

export enum VerificationStatus {
  Verified,
  Rejected,
  Awaiting,
}

export const printAwareCss = css`
  @media print {
    display: none;
  }
`
