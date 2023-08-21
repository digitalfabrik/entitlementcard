import { PDFForm, rgb } from 'pdf-lib'

import AddressExtensions from '../../cards/extensions/AddressFieldExtensions'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import { findExtension } from '../../cards/extensions/extensions'
import { InfoParams } from '../../cards/pdf/PdfTextElement'
import PlainDate from '../../util/PlainDate'
import { PdfConfig } from '../getProjectConfig'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info, cardBlueprint }: InfoParams) => {
  const expirationDay = info.expirationDay
  if (!expirationDay) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.nuernbergPassId
  const expirationDate = PlainDate.fromDaysSinceEpoch(expirationDay)
  const birthdayDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionBirthday?.birthday ?? 0)
  const startDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)
  return `${info.fullName}
Pass-ID: ${passId ?? ''}
Geburtsdatum: ${birthdayDate.format('dd.MM.yyyy')}
Gültig: ${startDate.format('dd.MM.yyyy')} bis ${expirationDate.format('dd.MM.yyyy')}`
}

const createAddressFormFields = (form: PDFForm, pageIdx: number, { info, cardBlueprint }: InfoParams) => {
  const [addressLine1, addressLine2, plz, location] = AddressExtensions.map(
    ext => findExtension(cardBlueprint.extensions, ext)?.state
  )

  const nameField = form.createTextField(`${pageIdx}.address.name`)
  const addressLine1Field = form.createTextField(`${pageIdx}.address.line.1`)
  const addressLine2Field = form.createTextField(`${pageIdx}.address.line.2`)
  const plzAndLocationField = form.createTextField(`${pageIdx}.address.location`)

  if (addressLine1 || addressLine2 || plz || location) {
    // avoid only printing the name
    nameField.setText(info.fullName)
  }
  if (addressLine1) addressLine1Field.setText(addressLine1)
  if (addressLine2) {
    addressLine2Field.setText(addressLine2)
  }
  if (plz && location) {
    if (!addressLine2) addressLine2Field.setText(`${plz} ${location}`)
    else plzAndLocationField.setText(`${plz} ${location}`)
  }
  return [nameField, addressLine1Field, addressLine2Field, plzAndLocationField]
}

const renderPassId = ({ cardBlueprint }: InfoParams) => {
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.nuernbergPassId
  return passId?.toString() ?? ''
}

const renderPassNumber = ({ info }: InfoParams) => {
  const passNumber = info.extensions?.extensionNuernbergPassNumber?.passNumber
  return passNumber ? `Nürnberg-Pass-Nr.: ${passNumber?.toString()}` : ''
}

const pdfConfiguration: PdfConfig = {
  title: 'Nürnberg-Pässe',
  templatePath: pdfTemplate,
  issuer: 'Stadt Nürnberg',
  elements: {
    staticVerificationQrCodes: [
      { x: 53, y: 222, size: 47 },
      { x: 164, y: 243, size: 21 },
    ],
    dynamicActivationQrCodes: [{ x: 122, y: 110, size: 63 }],
    text: [
      { x: 108, y: 243, width: 52, fontSize: 9, spacing: 5, infoToText: renderPdfDetails },
      { x: 129.5, y: 79, width: 44, fontSize: 13, color: rgb(0.17, 0.17, 0.2), infoToText: renderPassId },
      { x: 27, y: 265, width: 46, fontSize: 8, angle: 90, infoToText: renderPassNumber },
    ],
    form: [{ infoToFormFields: createAddressFormFields, x: 25, y: 66, width: 65, fontSize: 10 }],
  },
}

export default pdfConfiguration
