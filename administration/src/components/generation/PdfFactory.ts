import {jsPDF} from "jspdf";
import logo from "./logo";
import {drawjsPDF} from "../../util/qrcode";
import {CardCreationModel} from "./CardCreationModel";

function addLetter(doc: jsPDF) {
    const pageSize = doc.internal.pageSize
    const {width, height} = {width: pageSize.getWidth(), height: pageSize.getHeight()}
    const pageMargin = 20;
    const pageBottom = height - pageMargin;

    const logoSize = 25
    doc.addImage(logo, 'PNG', width / 2 - (logoSize / 2), pageMargin, logoSize, logoSize)
    doc.text("Ihre digitale Ehrenamtskarte ist da!", pageMargin, 60);

    doc.setFontSize(12)
    let instructionsY = 100;
    doc.text([
        'Anleitung:',
        "1. Laden Sie sich die App \"Ehrenamtskarte\" herunter.",
        "2. Starten Sie die App und folgen Sie den Hinweisen zum Scannen des Anmeldecodes.",
        "3. Scannen Sie den Anmeldecode.",
    ], pageMargin, instructionsY);

    const qrCodeSize = 100;
    const qrCodeY = pageBottom - qrCodeSize - 40;
    const qrCodeMarginTop = 5
    doc.setFontSize(16)
    doc.text("Anmeldecode:", pageMargin, qrCodeY - qrCodeMarginTop);
    drawjsPDF("A".repeat(223), pageMargin, qrCodeY, qrCodeSize, doc)

    doc.setFontSize(12)
    doc.textWithLink("https://ehrenamtskarte.app/download_app", width - pageMargin - 80, pageBottom, { url: "https://ehrenamtskarte.app/download_app" });
}

export function generatePdf(models: CardCreationModel[]) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    for (let k = 0; k < models.length; k++) {
        addLetter(doc)
        if (k != models.length - 1)
            doc.addPage()
    }

    doc.setDocumentProperties({
        title: "Anmeldecode",
        subject: "Anmeldecode",
        author: "Bayern",
        creator: "Bayern"
    });

    return doc.output('datauristring')
}
