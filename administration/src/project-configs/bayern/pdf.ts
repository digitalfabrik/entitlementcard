import { Temporal } from 'temporal-polyfill'

import { BavariaCardType } from '../../generated/card_pb'
import { formatDateDefaultGerman, plainDateFromDaysSinceEpoch } from '../../util/date'
import type { InfoParams, PdfConfig } from '../index'
import pdfTemplate from './pdf-template.pdf'

const renderPdfInfo = ({ info, region }: InfoParams): string => {
  const expirationDay = info.expirationDay ?? 0
  const cardType = info.extensions?.extensionBavariaCardType?.cardType

  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${
    expirationDay > 0
      ? formatDateDefaultGerman(plainDateFromDaysSinceEpoch(expirationDay))
      : 'unbegrenzt'
  }
Ausgestellt am ${formatDateDefaultGerman(Temporal.Now.plainDateISO())}
${region ? `von ${region.prefix} ${region.name}` : ''}`
}

const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash

const pdfConfiguration: PdfConfig = {
  title: 'Ehrenamtskarten',
  templatePath: pdfTemplate,
  issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
  customFont: 'inter/Inter-Regular.ttf',
  elements: {
    dynamicActivationQrCodes: [{ x: 140, y: 73, size: 51 }],
    text: [
      { x: 142, y: 137, maxWidth: 84, fontSize: 10, spacing: 4, infoToText: renderPdfInfo },
      { x: 165, y: 129, fontSize: 6, textAlign: 'center', infoToText: renderCardHash },
    ],
    deepLinkArea: { x: 140, y: 73, size: 51 },
  },
}

export default pdfConfiguration
