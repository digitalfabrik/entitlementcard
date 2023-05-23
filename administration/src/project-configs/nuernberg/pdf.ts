import { format } from 'date-fns'

import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import { findExtension } from '../../cards/extensions/extensions'
import PdfDetailElement, { InfoParams } from '../../cards/pdf/PdfDetailElement'
import PdfQrCodeElement from '../../cards/pdf/PdfQrCodeElement'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { PdfConfig } from '../getProjectConfig'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info }: InfoParams) => {
  const expirationDay = info.expirationDay
  if (!expirationDay) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }

  const expirationDate = format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy')
  return `${info.fullName}
Passnummer: ${info.extensions?.extensionNuernbergPassNumber?.passNumber}
Geburtsdatum: ${format(daysSinceEpochToDate(info.extensions?.extensionBirthday?.birthday ?? 0), 'dd.MM.yyyy')}
Gültig bis: ${expirationDate}`
}

const renderAdressDetails = () => {
  return ''
}

const renderPassId = ({ cardBlueprint }: InfoParams) => {
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.nuernbergPassId
  return passId?.toString() ?? ''
}

const pdfConfiguration: PdfConfig = {
  title: 'Nürnberg-Pässe',
  templatePath: pdfTemplate,
  issuer: 'Stadt Nürnberg',
  elements: {
    staticQrCodes: [PdfQrCodeElement({ x: 53, y: 222, size: 47 }), PdfQrCodeElement({ x: 164, y: 243, size: 21 })],
    dynamicQrCodes: [PdfQrCodeElement({ x: 122, y: 110, size: 63 })],
    details: [
      PdfDetailElement({ x: 108, y: 243, width: 52, fontSize: 9, infoToDetails: renderPdfDetails }),
      PdfDetailElement({ x: 25, y: 61, width: 73, fontSize: 12, infoToDetails: renderAdressDetails }),
      PdfDetailElement({ x: 129, y: 79, width: 44, fontSize: 12, infoToDetails: renderPassId }),
    ],
  },
}

export default pdfConfiguration
