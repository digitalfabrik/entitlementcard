import React, {useContext, useState} from "react";
import {Spinner} from "@blueprintjs/core";
import {CardCreationModel} from "./CardCreationModel";
import GenerationForm from "./GenerationForm";
import {useApolloClient} from "@apollo/client";
import {AppToaster} from "../AppToaster";
import GenerationFinished from "./GenerationFinished";
import downloadDataUri from "./downloadDataUri";
import generateCards from "./generateCards";
import RegionSelector from "../RegionSelector";
import {RegionIdContext} from "../../RegionIdProvider";

enum Mode {
    input,
    loading,
    finished
}

const GenerationController = () => {
    const [cardCreationModels, setCardCreationModels] = useState<CardCreationModel[]>([]);
    const client = useApolloClient();
    const [regionId] = useContext(RegionIdContext)
    const [mode, setMode] = useState(Mode.input);

    if (regionId === null) {
        return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <p>Bitte wählen Sie zunächst Ihre Region aus:</p>
            <RegionSelector/>
        </div>
    }

    const confirm = async () => {
        try {
            setMode(Mode.loading)
            const pdfDataUri = await generateCards(client, cardCreationModels, regionId)
            downloadDataUri(pdfDataUri, "ehrenamtskarten.pdf")
            setMode(Mode.finished)
        } catch (e) {
            console.error(e)
            AppToaster.show({message: "Etwas ist schiefgegangen.", intent: "danger"})
            setMode(Mode.input)
        }
    }
    if (mode === Mode.input)
        return <GenerationForm cardCreationModels={cardCreationModels} setCardCreationModels={setCardCreationModels}
                               confirm={confirm}/>
    else if (mode === Mode.loading)
        return <Spinner/>
    else // (mode === Mode.finished)
        return <GenerationFinished reset={() => {
            setCardCreationModels([]);
            setMode(Mode.input);
        }}/>
};

export default GenerationController;
