import { BaseApplicant } from './base-applicant'

export type KoblenzApplicant = BaseApplicant & {
  fileReference: string
}

// The entitlements are part of the dev data (backend/src/dev/sql/userentitlements.sql)
export const applicants = {
  standard: {
    name: 'Karla Koblenz',
    birthDate: '10.06.2003',
    fileReference: '100K',
  },
  unknownFileReference: {
    name: 'Ulla Unbekannt',
    birthDate: '10.06.2003',
    fileReference: 'invalid',
  },
  revokedEntitlement: {
    name: 'Erika Entzogen',
    birthDate: '28.05.2003',
    fileReference: '000D000001',
  },
} as const satisfies Record<string, KoblenzApplicant>
