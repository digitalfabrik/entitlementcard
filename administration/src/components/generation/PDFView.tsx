import React, {useEffect, useState} from "react";
import {generatePdf} from "./PdfFactory";
import {CardCreationModel} from "../../models/CardCreationModel";

interface Props {
    ccModels: CardCreationModel[]
}

export default (props: Props) => {
    const [pdfBlob, setPDFBlob] = useState<string | null>(null);

    useEffect(() => {
        const pdf = generatePdf(props.ccModels);
        setPDFBlob(pdf)
    }, []);

    if (!pdfBlob) {
        return null
    }

    return (
        <iframe width="100%" height="100%" src={pdfBlob}/>
    );
}
