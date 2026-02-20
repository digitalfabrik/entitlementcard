import { PDFForm, PDFTextField } from '@cantoo/pdf-lib'

import { getAddressFieldExtensionsValues } from '../../cards/extensions/AddressFieldExtensions'
import PlainDate from '../../util/PlainDate'
import type { InfoParams } from '../index'

export const renderPdfDetails = ({ info }: InfoParams): string => {
  const expirationDay = info.expirationDay

  if (expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }

  const passId = info.extensions?.extensionNuernbergPassId?.passId
  const expirationDate = PlainDate.fromDaysSinceEpoch(expirationDay)
  const birthdayDate = PlainDate.fromDaysSinceEpoch(
    info.extensions?.extensionBirthday?.birthday ?? 0,
  )
  const startDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)

  return `${info.fullName}
Pass-ID: ${passId ?? ''}
Geburtsdatum: ${birthdayDate.format()}
Gültig: ${startDate.format()} bis ${expirationDate.format()}`
}

export const createAddressFormFields = (
  form: PDFForm,
  pageIdx: number,
  { info, card }: InfoParams,
): PDFTextField[] => {
  const [addressLine1, addressLine2, plz, location] = getAddressFieldExtensionsValues(card)
  const nameField = form.createTextField(`${pageIdx}.address.name`)
  const addressLine1Field = form.createTextField(`${pageIdx}.address.line.1`)
  const addressLine2Field = form.createTextField(`${pageIdx}.address.line.2`)
  const plzAndLocationField = form.createTextField(`${pageIdx}.address.location`)

  if (addressLine1 || addressLine2 || plz || location) {
    // avoid only printing the name
    nameField.setText(info.fullName)
  }
  if (addressLine1) {
    addressLine1Field.setText(addressLine1)
  }
  if (addressLine2) {
    addressLine2Field.setText(addressLine2)
  }
  if (plz && location) {
    if (!addressLine2) {
      addressLine2Field.setText(`${plz} ${location}`)
    } else {
      plzAndLocationField.setText(`${plz} ${location}`)
    }
  }

  return [nameField, addressLine1Field, addressLine2Field, plzAndLocationField]
}

export const renderPassId = ({ info }: InfoParams): string =>
  info.extensions?.extensionNuernbergPassId?.passId?.toString() ?? ''

export const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash
