import { ApplicationVerification } from '../types'

export const verificationsAwaiting: ApplicationVerification[] = [
  {
    verificationId: 1,
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: null,
    verifiedDate: null,
  },
  {
    verificationId: 2,
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: null,
  },
]

export const verificationsMixed: ApplicationVerification[] = [
  {
    verificationId: 3,
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
  {
    verificationId: 4,
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: null,
  },
  {
    verificationId: 5,
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kneipenchor',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
]

export const verificationsRejected: ApplicationVerification[] = [
  {
    verificationId: 6,
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
  {
    verificationId: 7,
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
]
export const verificationsVerified: ApplicationVerification[] = [
  {
    verificationId: 8,
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
  {
    verificationId: 9,
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
]
