import { GetApplicationsType } from '../types'

export const verificationsAwaiting: GetApplicationsType['verifications'] = [
  {
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: null,
    verifiedDate: null,
  },
  {
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: null,
  },
]

export const verificationsMixed: GetApplicationsType['verifications'] = [
  {
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
  {
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: null,
  },
  {
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kneipenchor',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
]

export const verificationsRejected: GetApplicationsType['verifications'] = [
  {
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
  {
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: '2025-01-16T16:22:52.797342Z',
    verifiedDate: null,
  },
]
export const verificationsVerified: GetApplicationsType['verifications'] = [
  {
    contactEmailAddress: 'erika.musterfrau@posteo.de',
    organizationName: 'Verein420',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
  {
    contactEmailAddress: 'erik.mustermann@posteo.de',
    organizationName: 'Kunstverein',
    rejectedDate: null,
    verifiedDate: '2025-01-16T16:22:52.797342Z',
  },
]
