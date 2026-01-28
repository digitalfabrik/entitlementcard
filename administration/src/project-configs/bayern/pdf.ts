import type { InfoParams } from '../../cards/pdf/pdfTextElement'
import { BavariaCardType } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import type { PdfConfig } from '../getProjectConfig'
import pdfTemplate from './pdf-template.pdf'

const renderPdfInfo = ({ info, region }: InfoParams): string => {
  const expirationDay = info.expirationDay ?? 0
  const expirationDate =
    expirationDay > 0 ? PlainDate.fromDaysSinceEpoch(expirationDay).format() : 'unbegrenzt'

  const cardType = info.extensions?.extensionBavariaCardType?.cardType
  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
Ausgestellt am ${PlainDate.fromLocalDate(new Date()).format()} 
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
