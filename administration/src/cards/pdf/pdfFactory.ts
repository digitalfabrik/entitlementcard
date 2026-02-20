/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable no-else-return */

/* eslint-disable no-restricted-syntax */

/* eslint-disable no-await-in-loop */
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFFont,
  PDFName,
  PDFPage,
  PDFRawStream,
  StandardFonts,
  decodePDFRawStream,
} from '@cantoo/pdf-lib'
import fontkit from '@pdf-lib/fontkit'

import { Region } from '../../generated/graphql'
import { PdfConfig, PdfFontReference, ProjectConfig } from '../../project-configs'
import { getBuildConfig } from '../../util/getBuildConfig'
import { isProductionEnvironment } from '../../util/helper'
import normalizeString from '../../util/normalizeString'
import { reportErrorToSentry } from '../../util/sentry'
import { Card } from '../card'
import { CreateCardsResult } from '../createCards'
import getDeepLinkFromQrCode from '../getDeepLinkFromQrCode'
import {
  type PdfQrCode,
  pdfFormElement,
  pdfLinkArea,
  pdfQrCodeElement,
  pdfTextElement,
} from './elements'

export class PdfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PDFError'
  }
}

const fillContentAreas = async (
  targetDocument: PDFDocument,
  page: PDFPage,
  code: CreateCardsResult,
  card: Card,
  pdfConfig: PdfConfig,
  region: Region | undefined,
  fontRegular: PDFFont,
  fontBold: PDFFont,
): Promise<void> => {
  const dynamicCode: PdfQrCode = {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  }

  if (pdfConfig.elements?.deepLinkArea) {
    pdfLinkArea(
      page,
      getDeepLinkFromQrCode(
        dynamicCode,
        getBuildConfig(window.location.hostname),
        isProductionEnvironment(),
      ),
      pdfConfig.elements.deepLinkArea,
    )
  }

  pdfConfig.elements?.dynamicActivationQrCodes.forEach(configOptions =>
    pdfQrCodeElement(page, dynamicCode, configOptions),
  )

  if (pdfConfig.elements?.staticVerificationQrCodes) {
    if (code.staticVerificationCode) {
      const staticCode: PdfQrCode = {
        case: 'staticVerificationCode',
        value: code.staticVerificationCode,
      }

      pdfConfig.elements.staticVerificationQrCodes.forEach(configOptions =>
        pdfQrCodeElement(page, staticCode, configOptions),
      )
    } else {
      throw Error(
        'To create this PDF a static QR-Code is required. However, it seems to be missing.',
      )
    }
  }

  pdfConfig.elements?.form?.forEach(configOptions =>
    pdfFormElement(
      page,
      configOptions.infoToFormFields(targetDocument.getForm(), page.doc.getPageCount(), {
        info: dynamicCode.value.info!,
        region,
        card,
        cardInfoHash: code.dynamicCardInfoHashBase64,
      }),
      fontRegular,
      configOptions,
    ),
  )
  pdfConfig.elements?.text.forEach(configOptions =>
    pdfTextElement(
      page,
      configOptions.bold ? fontBold : fontRegular,
      configOptions.infoToText({
        info: dynamicCode.value.info!,
        region,
        card,
        cardInfoHash: code.dynamicCardInfoHashBase64,
      }),
      configOptions,
    ),
  )
}

export const generatePdf = async (
  codes: CreateCardsResult[],
  cards: Card[],
  projectConfig: ProjectConfig,
  region?: Region,
): Promise<Blob> => {
  try {
    const templateDocument = await PDFDocument.load(
      await (await fetch(projectConfig.pdf.templatePath)).arrayBuffer(),
    )
    templateDocument.registerFontkit(fontkit)

    const targetDocument = await PDFDocument.create()
    targetDocument.registerFontkit(fontkit)
    targetDocument.setTitle(projectConfig.pdf.title)
    targetDocument.setAuthor(projectConfig.pdf.issuer)

    const [fontRegular, fontBold] = await Promise.all([
      getFont(
        templateDocument,
        targetDocument,
        projectConfig.pdf.customFont,
        StandardFonts.Helvetica,
      ),
      getFont(
        templateDocument,
        targetDocument,
        projectConfig.pdf.customBoldFont,
        StandardFonts.HelveticaBold,
      ),
    ])

    for (let index = 0; index < codes.length; index++) {
      const [templatePage] = await targetDocument.copyPages(templateDocument, [0])
      const page = targetDocument.addPage(templatePage)
      await fillContentAreas(
        targetDocument,
        page,
        codes[index],
        cards[index],
        projectConfig.pdf,
        region,
        fontRegular,
        fontBold,
      )
    }

    return new Blob([(await targetDocument.save()).buffer as ArrayBuffer], {
      type: 'application/pdf',
    })
  } catch (error) {
    // TODO What is the point of this?
    if (error instanceof Error) {
      throw new PdfError(error.message)
    }
    throw error
  }
}

export const getPdfFilename = (cards: Card[]): string => {
  // "Berechtigungskarte_" prefix needs to always be in the filename to ensure Nuernberg automation will not break
  const filename =
    cards.length === 1
      ? `Berechtigungskarte_${normalizeString(cards[0].fullName)}-${new Date().getFullYear()}`
      : 'berechtigungskarten'
  return `${filename}.pdf`
}

async function getFont(
  templateDocument: PDFDocument,
  targetDocument: PDFDocument,
  fontReference: PdfFontReference,
  fallbackFont: string,
): Promise<PDFFont> {
  if (typeof fontReference === 'string') {
    // Try to copy the font from the template document.
    return (
      (await copyEmbeddedFont(templateDocument, targetDocument, fontReference)) ??
      targetDocument.embedFont(fallbackFont)
    )
  } else if (fontReference instanceof URL) {
    // Load the font from an URL
    return (await loadFont(targetDocument, fontReference)) ?? targetDocument.embedFont(fallbackFont)
  } else if (fontReference === null) {
    // The configured URL could not be parsed.
    reportErrorToSentry('Error loading custom font, URL not parseable')
    return targetDocument.embedFont(fallbackFont)
  } else {
    // No font configured
    return targetDocument.embedFont(fallbackFont)
  }
}

/**
 * Extract an embedded font from a template PDF document and copies it to a target PDF document.
 * Adapted from https://github.com/Hopding/pdf-lib/issues/463
 *
 * @returns The embedded font, or undefined if the font could not be found.
 */
async function copyEmbeddedFont(
  templateDocument: PDFDocument,
  targetDocument: PDFDocument,
  fontName: string,
): Promise<PDFFont | undefined> {
  try {
    for (const page of templateDocument.getPages()) {
      for (const [_, fontRef] of page.node.normalizedEntries().Font.entries()) {
        // Depending on the PDF, the font may accessible via any of these reference chains
        const fontDescriptor =
          templateDocument.context
            .lookupMaybe(fontRef, PDFDict)
            ?.lookupMaybe(PDFName.of('FontDescriptor'), PDFDict) ??
          templateDocument.context
            .lookupMaybe(
              templateDocument.context
                .lookupMaybe(fontRef, PDFDict)
                ?.lookupMaybe(PDFName.of('DescendantFonts'), PDFArray)
                ?.get(0),
              PDFDict,
            )
            ?.lookupMaybe(PDFName.of('FontDescriptor'), PDFDict)

        console.log(`Found desc ${fontDescriptor} --`)

        if (fontDescriptor) {
          const embeddedFontName = fontDescriptor.get(PDFName.of('FontName'))?.toString()
          // https://www.verypdf.com/document/pdf-format-reference/pg_0466.htm
          const fontFile = templateDocument.context.lookup(
            fontDescriptor.get(PDFName.of('FontFile2')),
          )

          // The font name contains a generated prefix, but this match should work for most fonts.
          if (embeddedFontName?.endsWith(fontName) && fontFile) {
            return targetDocument.embedFont(decodePDFRawStream(fontFile as PDFRawStream).decode())
          }
        }
      }
    }

    console.warn(`Embedded font ${fontName} not found`)
    reportErrorToSentry(`Error loading embedded font ${fontName}: not found`)
  } catch (error) {
    console.error(error)
    reportErrorToSentry(`Error loading embedded font ${fontName}: ${error}`)
  }
}

/** Load a font from an URL */
async function loadFont(doc: PDFDocument, url: URL): Promise<PDFFont | undefined> {
  const res = await fetch(url)

  if (res.ok && res.headers.get('Content-Type')?.includes('font')) {
    return doc.embedFont(await res.arrayBuffer())
  } else {
    reportErrorToSentry(`Couldn't load custom font from ${url}`)
  }
}
