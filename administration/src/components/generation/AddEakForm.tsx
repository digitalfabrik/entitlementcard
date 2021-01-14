import React from "react";
import {Card, Icon} from "@blueprintjs/core";
import './AddEakForm.css';

interface Props {
    onClick: () => void
}

const AddEakForm = (props: Props) => (
    <div className="add-eak-form">
        <a onClick={props.onClick}>
            <Card className="card" id="add-eak-form-card">
                <div className="add-eak-form-label">
                    <Icon icon="add" iconSize={20}/>
                    <p>Hinzufügen</p>
                </div>
            </Card>
        </a>
    </div>
);

export default AddEakForm;
