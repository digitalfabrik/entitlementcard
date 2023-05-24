import { format } from 'date-fns'
import { rgb } from 'pdf-lib'

import AddressExtensions from '../../cards/extensions/AddressFieldExtensons'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import { findExtension } from '../../cards/extensions/extensions'
import { InfoParams } from '../../cards/pdf/pdfTextElement'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { PdfConfig } from '../getProjectConfig'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info, cardBlueprint }: InfoParams) => {
  const expirationDay = info.expirationDay
  if (!expirationDay) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.nuernbergPassId
  const expirationDate = format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy')
  return `${info.fullName}
Pass-ID: ${passId ?? ''}
Geburtsdatum: ${format(daysSinceEpochToDate(info.extensions?.extensionBirthday?.birthday ?? 0), 'dd.MM.yyyy')}
Gültig bis: ${expirationDate}`
}

const renderAddressDetails = ({ info, cardBlueprint }: InfoParams) => {
  const [addressLine1, addressLine2, plz, location] = AddressExtensions.map(
    ext => findExtension(cardBlueprint.extensions, ext)?.state
  )
  if ((!addressLine1 && !addressLine2) || !plz || !location) {
    // avoid only printing the name
    return ''
  }
  const addressElements = [info.fullName, addressLine1, addressLine2, `${plz} ${location}`]
  return addressElements.join('\n')
}

const renderPassId = ({ cardBlueprint }: InfoParams) => {
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.nuernbergPassId
  return passId?.toString() ?? ''
}

const renderPassNumber = ({ info }: InfoParams) => {
  const passNumber = info.extensions?.extensionNuernbergPassNumber?.passNumber
  return passNumber ? `Nürnberg-Pass Nr.: ${passNumber?.toString()}` : ''
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
      { x: 25, y: 61, width: 73, fontSize: 12, spacing: 3, infoToText: renderAddressDetails },
      { x: 129.5, y: 79, width: 44, fontSize: 13, color: rgb(0.17, 0.17, 0.2), infoToText: renderPassId },
      { x: 27, y: 265, width: 46, fontSize: 8, angle: 90, infoToText: renderPassNumber },
    ],
  },
}

export default pdfConfiguration
