import React, {useState} from "react";
import {Spinner} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "./CardCreationModel";
import styled from "styled-components";
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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

    return (
        <Container>
            {mode === Mode.input &&
            <GenerationForm cardCreationModels={cardCreationModels} setCardCreationModels={setCardCreationModels}
                            confirm={confirm}/>}
            {mode === Mode.loading && <Spinner/>}
            {mode === Mode.finished && <GenerationFinished reset={() => {
                setCardCreationModels([]);
                setMode(Mode.input);
            }}/>}
        </Container>
    );
};

export default GenerationController;
