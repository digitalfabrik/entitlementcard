import React, {useEffect, useState} from "react";
import { jsPDF } from "jspdf";
import { drawjsPDF } from "../util/qrcode";

export default () => {
    const [pdfBlob, setPDFBlob] = useState<string | null>(null)

    useEffect(() => {
        const doc = new jsPDF();
        drawjsPDF("A".repeat(223), 200, doc)

        doc.text('Here is some vector graphixxx...', 100, 80);
        
        setPDFBlob(doc.output('datauristring'))
    }, [])

    if (!pdfBlob) {
        return null
    }
    
    return (
        <iframe width="775" height="775" src={pdfBlob}/>
    );
}
