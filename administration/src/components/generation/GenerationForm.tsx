import React from "react";
import EakForm from "./EakForm";
import {Button, Card, Tooltip} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel, isValid} from "./CardCreationModel";
import AddEakButton from "./AddEakButton";
import styled from "styled-components";
import FlipMove from 'react-flip-move'
import {add} from 'date-fns';
import {Prompt} from "react-router-dom";

let idCounter = 0;

const createEmptyCard = (): CardCreationModel => ({
    id: idCounter++,
    forename: "",
    surname: "",
    expirationDate: add(Date.now(), {years: 2}),
    cardType: CardType.standard
});

const ButtonBar = styled(({stickyTop: number, ...rest}) => <Card {...rest} />)<{ stickyTop: number }>`
  width: 100%;
  padding: 15px;
  background: #fafafa;
  position: sticky;
  z-index: 1;
  top: ${props => props.stickyTop}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  & button {
    margin: 5px;
  }
`;

const FormsWrapper = styled(FlipMove)`
  padding: 10px;
  width: 100%;
  z-index: 0;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`;

const FormColumn = styled.div`
  width: 400px;
  margin: 10px;
  box-sizing: border-box;
`;

interface Props {
    cardCreationModels: CardCreationModel[],
    setCardCreationModels: (models: CardCreationModel[]) => void,
    confirm: () => void
}

const GenerationForm = (props: Props) => {
    const {cardCreationModels, setCardCreationModels} = props
    const addForm = () => setCardCreationModels([...cardCreationModels, createEmptyCard()]);
    const updateModel = (oldModel: CardCreationModel, newModel: CardCreationModel | null) => {
        if (newModel === null)
            props.setCardCreationModels(cardCreationModels.filter(model => model !== oldModel));
        else
            setCardCreationModels(cardCreationModels.map(model => model === oldModel ? newModel : model))
    }

    const allCardsValid = cardCreationModels.reduce((acc, model) => acc && isValid(model), true)

    return (
        <>
            <Prompt message={"Die Eingaben werden verworfen, falls Sie fortfahren."}
                    when={cardCreationModels.length !== 0}/>
            <ButtonBar stickyTop={0}>
                <Tooltip>
                <Button icon="export" text="QR-Codes drucken" intent="success" onClick={props.confirm}
                        disabled={!allCardsValid || cardCreationModels.length === 0} />
                    {!allCardsValid && "Mindestens eine Karte enthält ungültige Eingaben."}
                    {cardCreationModels.length === 0 && "Legen Sie zunächst eine Karte an."}
                </Tooltip>
            </ButtonBar>
            <FormsWrapper>
                {cardCreationModels.map(model => <FormColumn key={model.id}>
                    <EakForm model={model} onUpdate={newModel => updateModel(model, newModel)}/>
                </FormColumn>)}
                <FormColumn key="AddButton">
                    <AddEakButton onClick={addForm}/>
                </FormColumn>
            </FormsWrapper>
        </>
    );
};

export default GenerationForm;
