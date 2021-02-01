import React, {useState} from "react";
import EakForm from "./EakForm";
import {Button, Card} from "@blueprintjs/core";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "../../models/CardCreationModel";
import AddEakForm from "./AddEakForm";
import styled from "styled-components";
import FlipMove from 'react-flip-move'
import PDFView from "./PDFView";
import {Route, Switch} from "react-router";
import {NavLink} from "react-router-dom";

let idCounter = 0;

const createEmptyCard = (): CardCreationModel => ({
    id: idCounter++,
    forename: "",
    surname: "",
    expirationDate: "",
    cardType: CardType.standard
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ButtonBar = styled(({ stickyTop: number, ...rest }) => <Card {...rest} />)<{ stickyTop: number }>`
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

const PdfWrapper = styled.div`
  position: absolute;
  display: flex;
  padding-top: 120px;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
`;

const EakGeneration = () => {

    const [cardCreationModels, setCardCreationModels] = useState([createEmptyCard()]);
    const [pdfView, setPdfView] = useState(false);

    const addForm = () => setCardCreationModels([...cardCreationModels, createEmptyCard()]);
    const removeForm = (id: number) => setCardCreationModels([...cardCreationModels].filter( model => model.id !== id));
    const reset = () => setCardCreationModels([createEmptyCard()]);
    const switchView = () => setPdfView(!pdfView);

    const forms = cardCreationModels.map(ccm => <FormColumn key={ccm.id}><EakForm onRemove={() => removeForm(ccm.id)}/></FormColumn>); // Todo!

    return (
        <Container>
            <Route exact path={"/eak-generation"}>
                <ButtonBar stickyTop={0}>
                    <NavLink to={"/eak-generation/pdf-viewer"}><Button icon="export" text="QR-Codes drucken" onClick={switchView} intent="success"/></NavLink>
                    <Button icon="reset" text="Zurücksetzen" onClick={reset} intent="warning"/>
                </ButtonBar>
                <FormsWrapper>
                    {forms}
                    <FormColumn key="AddButton">
                        <AddEakForm onClick={addForm}/>
                    </FormColumn>
                </FormsWrapper>
            </Route>
            <Route path={"/eak-generation/pdf-viewer"}>
                <ButtonBar stickyTop={0}>
                    <NavLink to={"/eak-generation"}><Button icon="undo" text="Zurück" onClick={switchView} intent="primary"/></NavLink>
                </ButtonBar>
                <PdfWrapper>
                    <PDFView ccModels={cardCreationModels} />
                </PdfWrapper>
            </Route>
        </Container>
    );
};

export default EakGeneration;
