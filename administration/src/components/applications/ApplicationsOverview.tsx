import {Card, H4, Icon} from "@blueprintjs/core";
import {format} from "date-fns";
import React from "react";
import {getApplications_applications as Application} from "../../graphql/applications/__generated__/getApplications";

interface Props {
    applications: Application[]
}

interface JsonField {
    name: string,
    translations: { de: string },
    type: 'Array' | 'String' | 'Number' | 'Boolean' | 'Attachment',
    value: any
}

function JsonFieldView(props: { jsonField: JsonField }) {
    if (props.jsonField.type === 'Array') {
        return <>
            <p><b>{props.jsonField.translations.de}</b></p>
            <div style={{paddingLeft: '10px', borderLeft: '1px solid #ccc'}}>
                {props.jsonField.value.map((jsonField: JsonField) => JsonFieldView({jsonField}))}
            </div>
        </>
    } else if (props.jsonField.type === 'String') {
        return <p>{props.jsonField.translations.de}: {props.jsonField.value}</p>
    } else if (props.jsonField.type === 'Number') {
        return <p>{props.jsonField.translations.de}: {props.jsonField.value}</p>
    } else if (props.jsonField.type === 'Boolean') {
        return <p>
            {props.jsonField.translations.de}:&nbsp;{
            props.jsonField.value ? <Icon icon='tick'/> : <Icon icon='cross'/>}
        </p>
    } else if (props.jsonField.type === 'Attachment') {
        return <p>
            {props.jsonField.translations.de}:&nbsp;<a href='#'><Icon icon='download'/>Anhang
            ({props.jsonField.value.fileName})</a>
        </p>
    } else {
        console.error(`Unknown type ${props.jsonField.type} found.`)
        return <p>Ein Fehler ist aufgetreten!</p>
    }
}

function ApplicationView(props: { application: Application }) {
    const {createdDate: createdDateString, id, jsonValue} = props.application
    const createdDate = new Date(createdDateString)
    const jsonField: JsonField = JSON.parse(jsonValue)

    return <Card>
        <H4>Antrag vom {format(createdDate, 'dd.MM.yyyy, HH:mm')}</H4>
        <JsonFieldView jsonField={jsonField}/>
    </Card>;
}

const ApplicationsOverview = (props: Props) => {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
        {props.applications.map(application => <ApplicationView application={application}/>)}
    </div>
}

export default ApplicationsOverview