import React, {useCallback, useEffect, useState} from "react";
import {EakForm} from "./EakForm";
import {Button} from "@blueprintjs/core";
import {CardCreationModel} from "../../models/CardCreationModel";
import {CardType} from "../../models/CardType";
import "./EakGeneration.css";
import AddEakForm from "./AddEakForm";

interface State {
    cardCreationModels: CardCreationModel[];
}

const createEmptyCard = () => ({
    forename: "",
    surname: "",
    expirationDate: "",
    cardType: CardType.standard
});

const EakGeneration = () => {

    const [cardCreationModels, setCardCreationModels] = useState([createEmptyCard()]);

    /*componentDidMount(): void {
        const firstFormColumn = document.getElementsByClassName("form-column")[0];
        const addEakBpCard = document.getElementById("add-eak-form-card")
        if (addEakBpCard != null) {
            addEakBpCard.style.height = firstFormColumn.clientHeight - 50 + "px"
        }
    }*/

    const addForm = useCallback(() => {
        var updatedForms = cardCreationModels;
        updatedForms.push(createEmptyCard());
        setCardCreationModels(updatedForms);
    }, [cardCreationModels, setCardCreationModels])

    const reset = () => {
        setCardCreationModels([createEmptyCard()]);
    };

    const forms = cardCreationModels.map(ccm => {
        return (
            <div className="form-column">
                <div className="form-spacing">
                    <EakForm />
                </div>
            </div>
        )
    });

    return (
        <div>
            <div className="button-bar">
                <Button icon="export" text="QR-Codes generieren" intent="success" />
                <Button icon="reset" text="Zurücksetzen" onClick={reset} intent="warning" />
            </div>
            <div className="forms-wrapper">
                <div className="forms">
                    {forms}
                    <div className="form-column">
                        <div className="form-spacing">
                            <AddEakForm onClick={addForm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EakGeneration;
