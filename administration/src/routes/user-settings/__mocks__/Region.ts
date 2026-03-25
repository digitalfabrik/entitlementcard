import { Region } from '../../../../src-gen/graphql'

export const getTestRegion = (options: {
  id?: number
  name?: string
  prefix?: string
  activatedForApplication?: boolean
  activatedForCardConfirmationMail?: boolean
  applicationConfirmationMailNoteActivated?: boolean
  applicationConfirmationMailNote?: string
}): Region => ({
  id: options.id ?? 0,
  name: options.name ?? 'Augsburg',
  prefix: options.prefix ?? 'a',
  activatedForApplication: options.activatedForApplication ?? true,
  activatedForCardConfirmationMail: options.activatedForCardConfirmationMail ?? true,
  applicationConfirmationMailNoteActivated:
    options.applicationConfirmationMailNoteActivated ?? false,
  applicationConfirmationMailNote: options.applicationConfirmationMailNote ?? null,
  dataPrivacyPolicy: null,
  regionIdentifier: null,
})
