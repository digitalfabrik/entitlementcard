import {jsPDF} from "jspdf";
import logo from "./logo";
import {drawjsPDF} from "../../util/qrcode";
import {CardActivateModel} from "../../generated/compiled";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {format, fromUnixTime} from "date-fns";
import {getRegions_regions as Region} from "../../graphql/regions/__generated__/getRegions";
import {Exception} from "../../exception";

type TTFFont = {
    /**
     * Name of the font. This should not include whitespaces.
     */
    name: string
    /**
     * Style of the font stored in `data` field. If in doubt use "normal" here.
     */
    fontStyle: string
    /**
     * TTF file encoded as base64 string
     */
    data: string
}

export async function loadTTFFont(name: string, fontStyle: string, path: string): Promise<TTFFont> {
    return {
        name,
        fontStyle,
        data: uint8ArrayToBase64(new Uint8Array(await (await fetch(path)).arrayBuffer()))
    }
}

function addLetter(doc: jsPDF, model: CardActivateModel, region: Region) {
    const pageSize = doc.internal.pageSize
    const {width, height} = {width: pageSize.getWidth(), height: pageSize.getHeight()}
    const pageMargin = 20;
    const pageBottom = height - pageMargin;

    const logoSize = 25
    doc.addImage(logo, 'PNG', width / 2 - (logoSize / 2), pageMargin, logoSize, logoSize)

    const greetingY = 60

    doc.setFontSize(16)
    doc.text(`Guten Tag, ${model.fullName}.
Ihre digitale Ehrenamtskarte ist da!`, pageMargin, greetingY);


    const qrCodeSize = 110;
    const qrCodeY = pageBottom - qrCodeSize - 40;
    const qrCodeX = (width - qrCodeSize) / 2;
    const qrCodeMargin = 5


    doc.setFontSize(12)
    const instructionsY = (qrCodeY - qrCodeMargin - 16 + greetingY) / 2;
    doc.text([
        'Anleitung:',
        "1. Laden Sie sich die App \"Ehrenamtskarte\" herunter.",
        "2. Starten Sie die App und folgen Sie den Hinweisen zum Scannen des Anmeldecodes.",
        "3. Scannen Sie den Anmeldecode.",
    ], pageMargin, instructionsY, {baseline: "middle"});

    doc.setFontSize(16)
    doc.text("Anmeldecode", width / 2, qrCodeY - qrCodeMargin, undefined, "center");
    const qrCodeText = uint8ArrayToBase64(CardActivateModel.encode(model).finish())
    drawjsPDF(qrCodeText, qrCodeX, qrCodeY, qrCodeSize, doc)
    doc.setFontSize(12);
    const DetailsY = qrCodeY + qrCodeSize + qrCodeMargin
    const expirationDate = model.expirationDate.toNumber() > 0 ? format(fromUnixTime(model.expirationDate.toNumber()),
        "dd.MM.yyyy") : "unbegrenzt"
    doc.text(
        `Name: ${model.fullName}
Karte ausgestellt am: ${format(new Date(), "dd.MM.yyyy")}
Karte gültig bis: ${expirationDate}
Aussteller: ${region.prefix} ${region.name}`,
        width / 2, DetailsY, {align: "center", baseline: "top"})

    doc.setFontSize(12)
    doc.textWithLink("Öffnen Sie den folgenden Link, um die App herunterzuladen:\nhttps://ehrenamtskarte.app/download_app", width / 2, pageBottom, {
        url: "https://ehrenamtskarte.app/download_app",
        align: "center"
    });
}

function checkForeignText(doc: jsPDF, text: string): string | null {
    let font = doc.getFont();
    
    for (let i = 0; i < text.length; i++) {
        if (font.metadata.characterToGlyph(text.charCodeAt(i)) === 0) {
            return text.charAt(i)
        }
    }

    return null
}

export function generatePdf(font: TTFFont, models: CardActivateModel[], region: Region) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    let fontFileName = `${font.name}.ttf`;
    doc.addFileToVFS(fontFileName, font.data);
    doc.addFont(fontFileName, font.name, font.fontStyle);
    doc.setFont(font.name)

    for (let k = 0; k < models.length; k++) {
        let model = models[k];
        let unsupportedChar = checkForeignText(doc, model.fullName);
        
        if (unsupportedChar) {
            throw new Exception({
                type: "unicode",
                unsupportedChar
            })
        }
        
        addLetter(doc, models[k], region)
        if (k !== models.length - 1)
            doc.addPage()
    }

    doc.setDocumentProperties({
        title: "Anmeldecode",
        subject: "Anmeldecode",
        author: "Bayern",
        creator: "Bayern"
    });

    try {
        let output = doc.output('blob');
        return new Blob([output], {type: "application/pdf"})
    } catch {
        throw new Exception({
            type: "pdf-generation",
        })
    }
}
