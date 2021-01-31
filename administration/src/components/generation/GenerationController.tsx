import React, {useState} from "react";
import {Spinner} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "./CardCreationModel";
import {add} from 'date-fns';
import GenerationForm from "./GenerationForm";
import {useApolloClient} from "@apollo/client";
import {AppToaster} from "../AppToaster";
import GenerationFinished from "./GenerationFinished";
import downloadDataUri from "./downloadDataUri";
import generateCards from "./generateCards";

let idCounter = 0;

const createEmptyCard = (): CardCreationModel => ({
    id: idCounter++,
    forename: "",
    surname: "",
    expirationDate: add(Date.now(), {years: 2}),
    cardType: CardType.standard
});

enum Mode {
    input,
    loading,
    finished
}

const GenerationController = () => {
    const [cardCreationModels, setCardCreationModels] = useState([createEmptyCard()]);
    const client = useApolloClient();
    const [mode, setMode] = useState(Mode.input);
    const confirm = async () => {
        try {
            setMode(Mode.loading)
            const pdfDataUri = await generateCards(client, cardCreationModels)
            downloadDataUri(pdfDataUri, "ehrenamtskarten.pdf")
            setMode(Mode.finished)
        } catch (e) {
            console.error(e)
            AppToaster.show({message: "Something went wrong.", intent: "danger"})
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
