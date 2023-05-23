import { format } from 'date-fns'

import { InfoParams } from '../../cards/pdf/pdfTextElement'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { BavariaCardType } from '../../generated/card_pb'
import { PdfConfig } from '../getProjectConfig'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const renderPdfInfo = ({ info, region }: InfoParams) => {
  const expirationDay = info.expirationDay ?? 0
  const expirationDate = expirationDay > 0 ? format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy') : 'unbegrenzt'

  const cardType = info.extensions?.extensionBavariaCardType?.cardType
  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
Ausgestellt am ${format(new Date(), 'dd.MM.yyyy')} 
von ${region.prefix} ${region.name}`
}

const pdfConfiguration: PdfConfig = {
  title: 'Ehrenamtskarten',
  templatePath: pdfTemplate,
  issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
  elements: {
    dynamicActivationQrCodes: [{ x: 108, y: 73, size: 84 }],
    text: [{ x: 108, y: 170, width: 84, fontSize: 10, spacing: 4, infoToText: renderPdfInfo }],
  },
}

export default pdfConfiguration
