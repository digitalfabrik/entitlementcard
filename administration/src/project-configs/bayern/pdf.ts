import { InfoParams } from '../../cards/pdf/PdfTextElement'
import { BavariaCardType } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import { PdfConfig } from '../getProjectConfig'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const renderPdfInfo = ({ info, region }: InfoParams) => {
  const expirationDay = info.expirationDay ?? 0
  const expirationDate =
    expirationDay > 0 ? PlainDate.fromDaysSinceEpoch(expirationDay).format('dd.MM.yyyy') : 'unbegrenzt'

  const cardType = info.extensions?.extensionBavariaCardType?.cardType
  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
Ausgestellt am ${PlainDate.fromLocalDate(new Date()).format('dd.MM.yyyy')} 
von ${region.prefix} ${region.name}`
}

const renderCardHash = ({ cardInfoHash }: InfoParams) => {
  return cardInfoHash
}

const pdfConfiguration: PdfConfig = {
  title: 'Ehrenamtskarten',
  templatePath: pdfTemplate,
  issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
  elements: {
    dynamicActivationQrCodes: [{ x: 108, y: 73, size: 84 }],
    text: [
      { x: 108, y: 170, width: 84, fontSize: 10, spacing: 4, infoToText: renderPdfInfo },
      { x: 134, y: 162, width: 46, fontSize: 4, angle: 0, infoToText: renderCardHash },
    ],
  },
}

export default pdfConfiguration
