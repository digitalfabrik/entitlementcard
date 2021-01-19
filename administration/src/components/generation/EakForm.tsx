import React, {useState} from "react";
import {Button, Card, FormGroup, InputGroup, MenuItem} from "@blueprintjs/core";
import {ItemRenderer, Select} from "@blueprintjs/select";
import {CardType} from "../../models/CardType";
import {DateInput} from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

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

const EakForm = () => {
    const values = Object.values(CardType);
    const [selected, setSelected] = useState(values[0]);
    const [expirationDate, setExpirationDate] = useState(new Date());

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
                    <DateInput placeholder="Ablaufdatum" value={expirationDate}
                               parseDate={str => new Date(str)}
                               onChange={value => setExpirationDate(value)}
                               formatDate={date => date.toLocaleDateString()}
                               fill={true}
                    />
                </FormGroup>
                <FormGroup label="Typ der Karte">
                    <CardTypeSelect
                        items={values}
                        onItemSelect={(value) => {
                            setSelected(value)
                        }}
                        itemRenderer={renderCardType}
                        filterable={false}
                    >
                        <Button className={"cardTypeSelect"} text={selected} rightIcon="caret-down"/>
                    </CardTypeSelect>
                </FormGroup>
            </Card>
        </div>
    )
};

export default EakForm;
