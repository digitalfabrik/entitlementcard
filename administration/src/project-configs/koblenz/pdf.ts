import { InfoParams } from '../../cards/pdf/PdfTextElement'
import PlainDate from '../../util/PlainDate'
import { PdfConfig } from '../getProjectConfig'
import pdfTemplate from './pdf-template.pdf'

const renderPdfCardInfos = ({ info }: InfoParams): string => {
  const expirationDay = info.expirationDay
  if (expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Koblenz')
  }
  const expirationDate = PlainDate.fromDaysSinceEpoch(expirationDay)
  const birthdayDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionBirthday?.birthday ?? 0)
  const startDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)
  return `${startDate.format()} - ${expirationDate.format()}
${birthdayDate.format()}
${info.fullName}`
}

const renderPdfCardLabels = (): string => `Gültigkeitszeitraum
Geburtsdatum
Name`

const pdfConfiguration: PdfConfig = {
  title: 'KoblenzPass',
  templatePath: pdfTemplate,
  customBoldFont: 'texgyreheros-bold.ttf',
  customRegularFont: 'texgyreheros-regular.ttf',
  issuer: 'Stadt Koblenz',
  elements: {
    staticVerificationQrCodes: [{ x: 152, y: 230, size: 34 }],
    dynamicActivationQrCodes: [{ x: 130, y: 103, size: 54 }],
    text: [
      { x: 109, y: 254, maxWidth: 80, fontSize: 9, bold: true, spacing: 10, infoToText: renderPdfCardInfos },
      { x: 109, y: 249, maxWidth: 80, fontSize: 5.5, bold: false, spacing: 16, infoToText: renderPdfCardLabels },
    ],
    deepLinkArea: { x: 130, y: 103, size: 54 },
  },
}

export default pdfConfiguration
