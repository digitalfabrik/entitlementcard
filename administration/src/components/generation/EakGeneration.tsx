import React, {useCallback, useEffect, useState} from "react";
import EakForm from "./EakForm";
import {Button, PopoverPosition} from "@blueprintjs/core";
import {CardCreationModel} from "../../models/CardCreationModel";
import {CardType} from "../../models/CardType";
import "./EakGeneration.css";
import AddEakForm from "./AddEakForm";

const createEmptyCard = (): CardCreationModel => ({
    forename: "",
    surname: "",
    expirationDate: "",
    cardType: CardType.standard
});

const EakGeneration = () => {

    const [cardCreationModels, setCardCreationModels] = useState([createEmptyCard()]);

    useEffect(() => {
        const firstFormColumn = document.getElementsByClassName("form-column")[0];
        const addEakBpCard = document.getElementById("add-eak-form-card");
        if (addEakBpCard != null) {
            addEakBpCard.style.height = firstFormColumn.clientHeight - 50 + "px" // clientHeight includes 50 px of margin
        }
    });

    const addForm = () => {
        const updatedForms = [... cardCreationModels];
        updatedForms.push(createEmptyCard());
        setCardCreationModels(updatedForms);
    };

    const reset = () => {
        setCardCreationModels([createEmptyCard()]);
    };

    var index = 0;
    const forms = cardCreationModels.map(ccm => {
        const position = index % 4 == 3 ? PopoverPosition.LEFT : PopoverPosition.RIGHT;
        index++;
        return (
            <div className="form-column">
                <div className="form-spacing">
                    <EakForm datePickerPosition={position} />
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
