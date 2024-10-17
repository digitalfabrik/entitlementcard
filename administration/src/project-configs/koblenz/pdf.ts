import { InfoParams } from '../../cards/pdf/PdfTextElement'
import PlainDate from '../../util/PlainDate'
import { PdfConfig } from '../getProjectConfig'
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info }: InfoParams): string => {
  const expirationDay = info.expirationDay
  if (expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Koblenz')
  }
  const expirationDate = PlainDate.fromDaysSinceEpoch(expirationDay)
  const birthdayDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionBirthday?.birthday ?? 0)
  const startDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)
  return `${info.fullName}
Geburtsdatum: ${birthdayDate.format()}
Gültig: ${startDate.format()} bis ${expirationDate.format()}`
}

const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash

// TODO 1422 Create PDF for koblenz

const pdfConfiguration: PdfConfig = {
  title: 'KoblenzPässe',
  templatePath: pdfTemplate,
  issuer: 'Stadt Koblenz',
  elements: {
    staticVerificationQrCodes: [
      { x: 53, y: 222, size: 47 },
      { x: 164, y: 243, size: 21 },
    ],
    dynamicActivationQrCodes: [{ x: 122, y: 110, size: 63 }],
    text: [
      { x: 108, y: 243, maxWidth: 52, fontSize: 9, spacing: 5, infoToText: renderPdfDetails },
      { x: 153.892, y: 178, fontSize: 6, textAlign: 'center', infoToText: renderCardHash },
    ],
  },
}

export default pdfConfiguration
