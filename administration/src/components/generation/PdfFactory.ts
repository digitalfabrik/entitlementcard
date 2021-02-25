import {jsPDF} from "jspdf";
import logo from "./logo";
import {drawjsPDF} from "../../util/qrcode";
import {CardActivateModel} from "../../generated/compiled";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {format, fromUnixTime} from "date-fns";

function addLetter(doc: jsPDF, model: CardActivateModel) {
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
    const expirationDate = model.optionalExpirationDate !== undefined ? format(fromUnixTime(model.expirationDate.toNumber()),
        "dd.MM.yyyy") : "unbegrenzt"
    doc.text(
        `KarteninhaberIn: ${model.fullName}
Karte ausgestellt am: ${format(new Date(), "dd.MM.yyyy")}
Karte gültig bis: ${expirationDate}`,
        width / 2, DetailsY, {align: "center", baseline: "top"})

    doc.setFontSize(12)
    doc.textWithLink("Öffnen Sie den folgenden Link, um die App herunterzuladen:\nhttps://ehrenamtskarte.app/download_app", width / 2, pageBottom, {
        url: "https://ehrenamtskarte.app/download_app",
        align: "center"
    });
}

export function generatePdf(models: CardActivateModel[]) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    for (let k = 0; k < models.length; k++) {
        addLetter(doc, models[k])
        if (k !== models.length - 1)
            doc.addPage()
    }

    doc.setDocumentProperties({
        title: "Anmeldecode",
        subject: "Anmeldecode",
        author: "Bayern",
        creator: "Bayern"
    });

    return doc.output('blob')
}
