import React from "react";
import {FormGroup, InputGroup, Button, MenuItem, Card} from "@blueprintjs/core";
import './EakForm.css';
import {ItemRenderer, Select} from "@blueprintjs/select";
import {CardType} from "../../models/CardType";
import {CardCreationModel} from "../../models/CardCreationModel";

const CardTypeSelect = Select.ofType<CardType>();

interface Props {
    model: CardCreationModel
}

export class EakForm extends React.Component<Props> {

    private renderCardType: ItemRenderer<CardType> = (cardType, { handleClick, modifiers, query }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const text = `${cardType}`;
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                label={cardType}
                key={cardType}
                onClick={handleClick}
            />
        );
    };

    render() {
        const values = Object.values(CardType);

        return (
            <div className="form">
                <Card>
                    <FormGroup label="Vorname">
                        <InputGroup placeholder="Vorname" />
                    </FormGroup>
                    <FormGroup label="Nachname">
                        <InputGroup placeholder="Nachname" />
                    </FormGroup>
                    <FormGroup label="Ablaufdatum">
                        <InputGroup placeholder="Ablaufdatum" />
                    </FormGroup>
                    <FormGroup label="Typ der Karte">
                        <CardTypeSelect
                            items={values}
                            onItemSelect={() => {}}
                            itemRenderer={this.renderCardType}
                            filterable={false}
                        >
                            <Button className={"cardTypeSelect"} text={values[0]} rightIcon="caret-down" />
                        </CardTypeSelect>
                    </FormGroup>
                </Card>
            </div>
        )
    }

}
