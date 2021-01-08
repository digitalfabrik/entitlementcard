import React from "react";
import {EakForm} from "./EakForm";
import {Button, ButtonGroup} from "@blueprintjs/core";
import {CardCreationModel} from "../../models/CardCreationModel";
import {CardType} from "../../models/CardType";
import "./EakGeneration.css";
import {AddEakForm} from "./AddEakForm";
import {INTENT_DANGER} from "@blueprintjs/core/lib/esm/common/classes";

interface Props {

}

interface State {
    cardCreationModels: CardCreationModel[];
}

export class EakGeneration extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            cardCreationModels: [EakGeneration.createEmptyCard()]
        };

        this.addForm = this.addForm.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount(): void {
        const firstFormColumn = document.getElementsByClassName("form-column")[0];
        const addEakBpCard = document.getElementById("add-eak-form-card")
        if (addEakBpCard != null) {
            addEakBpCard.style.height = firstFormColumn.clientHeight - 50 + "px"
        }
    }

    private static createEmptyCard() {
        return {
            forename: "",
            surname: "",
            expirationDate: "",
            cardType: CardType.standard
        }
    }

    private addForm() {
        var updatedForms = this.state.cardCreationModels;
        updatedForms.push(EakGeneration.createEmptyCard());
        this.setState({
            cardCreationModels: updatedForms
        });
    }

    private reset() {
        this.setState({
            cardCreationModels: [EakGeneration.createEmptyCard()]
        })
    }

    render() {
        var forms = this.state.cardCreationModels.map(ccm => {
            return (
                <div className="form-column">
                    <div className="form-spacing">
                        <EakForm model={ccm} />
                    </div>
                </div>
            )
        });

        return(
            <div>
                <div className="button-bar">
                    <Button icon="export" text="QR-Codes generieren" intent="success" />
                    <Button icon="reset" text="Zurücksetzen" onClick={this.reset} intent="warning" />
                </div>
                <div className="forms-wrapper">
                    <div className="forms">
                        {forms}
                        <div className="form-column">
                            <div className="form-spacing">
                                <AddEakForm onClick={this.addForm} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
