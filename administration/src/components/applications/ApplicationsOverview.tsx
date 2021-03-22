import {Button, Card, H4, Icon} from "@blueprintjs/core";
import {format} from "date-fns";
import React from "react";
import {getApplications_applications as Application} from "../../graphql/applications/__generated__/getApplications";
import {AppToaster} from "../AppToaster";
import downloadDataUri from "../../util/downloadDataUri";

interface Props {
    applications: Application[],
    token: string
}

interface JsonField {
    name: string,
    translations: { de: string },
    type: 'Array' | 'String' | 'Number' | 'Boolean' | 'Attachment',
    value: any
}

function JsonFieldView(props: { jsonField: JsonField, baseUrl: string, token: string }) {
    if (props.jsonField.type === 'Array') {
        return <>
            <p><b>{props.jsonField.translations.de}</b></p>
            <div style={{paddingLeft: '10px', borderLeft: '1px solid #ccc'}}>
                {props.jsonField.value.map((jsonField: JsonField) => JsonFieldView({
                    jsonField,
                    baseUrl: props.baseUrl,
                    token: props.token
                }))}
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
        const attachement = props.jsonField.value
        const downloadUrl = `${props.baseUrl}/file/${attachement.fileIndex}`
        const onClick = () => {
            AppToaster.show({ message: `Lädt ${attachement.fileName}...`, intent: 'primary'})
            fetch(downloadUrl, { headers: { authorization: `Bearer ${props.token}` } })
                .then(result => {
                    if (result.status === 200)
                        return result.arrayBuffer()
                    else throw Error("Status code not OK")
                })
                .then(result => {
                    const file = new File([result], attachement.fileName)
                    downloadDataUri(file, attachement.fileName)
                })
                .catch(() => AppToaster.show({ message: 'Etwas ist schiefgelaufen.', intent: 'danger'}))
        }
        return <p>
            {props.jsonField.translations.de}:&nbsp;<Button icon='download' onClick={onClick}>
            Anhang ({props.jsonField.value.fileName})</Button>
        </p>
    } else {
        console.error(`Unknown type ${props.jsonField.type} found.`)
        return <p>Ein Fehler ist aufgetreten!</p>
    }
}

function ApplicationView(props: { application: Application, token: string }) {
    const {createdDate: createdDateString, jsonValue, id} = props.application
    const createdDate = new Date(createdDateString)
    const jsonField: JsonField = JSON.parse(jsonValue)
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${id}`

    return <Card elevation={2}>
        <H4>Antrag vom {format(createdDate, 'dd.MM.yyyy, HH:mm')}</H4>
        <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} token={props.token} />
    </Card>;
}

const ApplicationsOverview = (props: Props) => {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
        {props.applications.map(application => <ApplicationView application={application} token={props.token} />)}
    </div>
}

export default ApplicationsOverview