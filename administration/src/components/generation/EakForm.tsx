import React from "react";
import {Button, Card, FormGroup, InputGroup, MenuItem} from "@blueprintjs/core";
import {ItemRenderer, Select} from "@blueprintjs/select";
import {CardType} from "../../models/CardType";

const CardTypeSelect = Select.ofType<CardType>();


const renderCardType: ItemRenderer<CardType> = (cardType, {handleClick, modifiers, query}) => {
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

export const EakForm = () => {
    const values = Object.values(CardType);

    return (
        <div>
            <Card>
                <FormGroup label="Vorname">
                    <InputGroup placeholder="Vorname"/>
                </FormGroup>
                <FormGroup label="Nachname">
                    <InputGroup placeholder="Nachname"/>
                </FormGroup>
                <FormGroup label="Ablaufdatum">
                    <InputGroup placeholder="Ablaufdatum"/>
                </FormGroup>
                <FormGroup label="Typ der Karte">
                    <CardTypeSelect
                        items={values}
                        onItemSelect={() => {
                        }}
                        itemRenderer={renderCardType}
                        filterable={false}
                    >
                        <Button className={"cardTypeSelect"} text={values[0]} rightIcon="caret-down"/>
                    </CardTypeSelect>
                </FormGroup>
            </Card>
        </div>
    )
};
