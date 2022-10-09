import React from "react";
import {Button, Icon} from "@blueprintjs/core";
import downloadDataUri from "../../util/downloadDataUri";
import {FunctionComponent} from "react";
import {useAppToaster} from "../AppToaster";


export interface JsonField {
    name: string,
    translations: { de: string },
    type: 'Array' | 'String' | 'Number' | 'Boolean' | 'Attachment',
    value: any
}

const JsonFieldView: FunctionComponent<{ jsonField: JsonField, baseUrl: string, token: string, key?: number }> = props => {
    const appToaster = useAppToaster()

    if (props.jsonField.type === 'Array') {
        return <>
            <p><b>{props.jsonField.translations.de}</b></p>
            <div style={{paddingLeft: '10px', borderLeft: '1px solid #ccc'}}>
                {props.jsonField.value.map((jsonField: JsonField, index: number) => JsonFieldView({
                    jsonField,
                    baseUrl: props.baseUrl,
                    token: props.token,
                    key: index
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
            appToaster?.show({message: `Lädt ${attachement.fileName}...`, intent: 'primary'})
            fetch(downloadUrl, {headers: {authorization: `Bearer ${props.token}`}})
                .then(result => {
                    if (result.status === 200)
                        return result.arrayBuffer()
                    else throw Error("Status code not OK")
                })
                .then(result => {
                    const file = new File([result], attachement.fileName)
                    downloadDataUri(file, attachement.fileName)
                })
                .catch(() => appToaster?.show({message: 'Etwas ist schiefgelaufen.', intent: 'danger'}))
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

export default JsonFieldView;
