import { BaseApplicant } from './base-applicant'

export type NuernbergApplicant = BaseApplicant & {
  startDate: string // dd.MM.yyyy
  expiryDate: string // dd.MM.yyyy
  passId: string // numeric
  street1?: string // Adresszeile 1
  street2?: string // Adresszeile 2
  postalCode?: string
  city?: string
}

// The dates are fixed, as they are part of the PDF snapshots. The administration only accepts start dates
// up to 5 years in the past and expiry dates in the future, so the dates have to be adjusted before 2036.
export const applicants = {
  standard: {
    name: 'Nina Nürnberg',
    birthDate: '15.03.1985',
    startDate: '01.01.2030',
    expiryDate: '31.12.2035',
    passId: '12345',
  },
  withAddress: {
    name: 'Anna Anschrift',
    birthDate: '20.06.1990',
    startDate: '01.01.2030',
    expiryDate: '31.12.2035',
    passId: '67890',
    street1: 'Hauptstraße 1',
    street2: '',
    postalCode: '90402',
    city: 'Nürnberg',
  },
  blockName: {
    name: 'Bao Blockname +',
    birthDate: '03.11.2000',
    startDate: '01.01.2030',
    expiryDate: '31.12.2035',
    passId: '24680',
  },
} as const satisfies Record<string, NuernbergApplicant>
