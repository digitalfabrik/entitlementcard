import React, {useState} from "react";
import {Spinner} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "./CardCreationModel";
import styled from "styled-components";
import {add} from 'date-fns';
import GenerationForm from "./GenerationForm";
import {useApolloClient} from "@apollo/client";
import generateCardActivateModel from "../../util/generateCardActivateModel";
import {CardActivateModel} from "../../generated/compiled";
import {addCard, addCardVariables} from "../../graphql/verification/__generated__/addCard";
import {ADD_CARD} from "../../graphql/verification/mutations";
import generateHashFromHashModel from "../../util/generateHashFromHashModel";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {AppToaster} from "../AppToaster";
import GenerationFinished from "./GenerationFinished";
import {generatePdf} from "./PdfFactory";
import {CardInput} from "../../../__generated__/globalTypes";
import downloadDataUri from "./downloadDataUri";

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
            const region = 0; // TODO: Add correct region
            const activateModels = cardCreationModels.map(model => {
                const cardType = model.cardType === CardType.gold
                    ? CardActivateModel.CardType.GOLD
                    : CardActivateModel.CardType.STANDARD
                return generateCardActivateModel(
                    `${model.forename} ${model.surname}`,
                    region,
                    model.expirationDate,
                    cardType)
            })
            setMode(Mode.loading)
            const cardInputs: CardInput[] = await Promise.all(
                activateModels.map(async (model) => {
                    const hashModel = await generateHashFromHashModel(model)
                    return {
                        expirationDate: model.expirationDate,
                        hashModelBase64: uint8ArrayToBase64(hashModel),
                        totpSecretBase64: uint8ArrayToBase64(model.totpSecret)
                    }
                }))
            const results = await Promise.all(
                cardInputs.map(card =>
                    client.mutate<addCard, addCardVariables>({mutation: ADD_CARD, variables: {card}}))
            )
            const fail = results.find(result => result.errors || !result.data?.success)
            if (fail) throw Error(JSON.stringify(fail))

            const pdfDataUri = generatePdf(cardCreationModels)
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
