import React, {useState} from "react";
import {Card} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "./CardCreationModel";
import styled from "styled-components";
import {add} from 'date-fns';
import GenerationForm from "./GenerationForm";

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
    error,
    finished
}

const GenerationController = () => {
    const [cardCreationModels, setCardCreationModels] = useState([createEmptyCard()]);
    const [mode, setMode] = useState(Mode.input);
    const confirm = async () => { }; // todo: Just do it!

    return (
        <Container>
            {mode === Mode.input &&
            <GenerationForm cardCreationModels={cardCreationModels} setCardCreationModels={setCardCreationModels}
                            confirm={confirm}/>}
        </Container>
    );
};

export default GenerationController;
