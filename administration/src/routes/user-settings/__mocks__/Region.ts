import { Region } from '../../../generated/graphql'

export const getTestRegion = (options: {
  id?: number
  name?: string
  prefix?: string
  activatedForApplication?: boolean
  activatedForCardConfirmationMail?: boolean
  applicationConfirmationMailNoteActivated?: boolean
  applicationConfirmationMailNote?: string
}): Region => {
  const {
    id,
    name,
    prefix,
    activatedForApplication,
    activatedForCardConfirmationMail,
    applicationConfirmationMailNoteActivated,
    applicationConfirmationMailNote,
  } = options
  return {
    id: id ?? 0,
    name: name ?? 'Augsburg',
    prefix: prefix ?? 'a',
    activatedForApplication: activatedForApplication ?? true,
    activatedForCardConfirmationMail: activatedForCardConfirmationMail ?? true,
    applicationConfirmationMailNoteActivated: applicationConfirmationMailNoteActivated ?? false,
    applicationConfirmationMailNote: applicationConfirmationMailNote ?? null,
  }
}
