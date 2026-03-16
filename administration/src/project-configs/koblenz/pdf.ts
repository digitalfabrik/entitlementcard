import type { InfoParams } from '../../cards/pdf/pdfTextElement'
import { formatDateDefaultGerman, plainDateFromDaysSinceEpoch } from '../../util/date'
import type { PdfConfig } from '../getProjectConfig'
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info }: InfoParams): string => {
  const expirationDay = info.expirationDay
  if (expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Koblenz')
  }
  const expirationDate = plainDateFromDaysSinceEpoch(expirationDay)
  const birthdayDate = plainDateFromDaysSinceEpoch(
    info.extensions?.extensionBirthday?.birthday ?? 0,
  )
  const startDate = plainDateFromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)
  return `${formatDateDefaultGerman(startDate)} - ${formatDateDefaultGerman(expirationDate)}
${formatDateDefaultGerman(birthdayDate)}
${info.fullName}`
}

const pdfConfiguration: PdfConfig = {
  title: 'KoblenzPass',
  templatePath: pdfTemplate,
  customFont: 'texgyreheros-regular.ttf',
  customBoldFont: 'texgyreheros-bold.ttf',
  issuer: 'Stadt Koblenz',
  elements: {
    staticVerificationQrCodes: [{ x: 152, y: 230, size: 34 }],
    dynamicActivationQrCodes: [{ x: 130, y: 103, size: 54 }],
    text: [
      {
        x: 109,
        y: 254,
        maxWidth: 80,
        fontSize: 9,
        bold: true,
        spacing: 10,
        infoToText: renderPdfDetails,
      },
    ],
    deepLinkArea: { x: 130, y: 103, size: 54 },
  },
}

export default pdfConfiguration
