import React from "react";
import {FormGroup, InputGroup, Button, MenuItem, Card, Icon} from "@blueprintjs/core";
import './AddEakForm.css';

interface Props {
    onClick: () => void
}
export class AddEakForm extends React.Component<Props> {

    render() {
        return (
            <div className="add-eak-form">
                <a onClick={this.props.onClick}>
                    <Card className="card" id="add-eak-form-card">
                        <div className="add-eak-form-label">
                            <Icon icon="add" iconSize={20} />
                            <p>Hinzufügen</p>
                        </div>
                    </Card>
                </a>
            </div>
        )
    }

}
