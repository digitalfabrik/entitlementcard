import React from 'react'
import { Button, Icon } from '@blueprintjs/core'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'

export type JsonField<T extends keyof JsonFieldValueByType> = {
  name: string
  translations: { de: string }
  type: T
  value: JsonFieldValueByType[T]
}

export type GeneralJsonField = { [K in keyof JsonFieldValueByType]: JsonField<K> }[keyof JsonFieldValueByType]

type JsonFieldValueByType = {
  Array: GeneralJsonField[]
  String: string
  Number: number
  Boolean: boolean
  Attachment: { fileIndex: number }
}

const extensionByContentType = new Map([
  ['application/pdf', 'pdf'],
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
])

const JsonFieldView = (props: { jsonField: GeneralJsonField; baseUrl: string; token: string }) => {
  const appToaster = useAppToaster()
  switch (props.jsonField.type) {
    case 'Array':
      return (
        <>
          <p>
            <b>{props.jsonField.translations.de}</b>
          </p>
          <div style={{ paddingLeft: '10px', borderLeft: '1px solid #ccc' }}>
            {props.jsonField.value.map((jsonField: GeneralJsonField, index: number) => (
              <JsonFieldView jsonField={jsonField} baseUrl={props.baseUrl} token={props.token} key={index} />
            ))}
          </div>
        </>
      )
    case 'String':
      return (
        <p>
          {props.jsonField.translations.de}: {props.jsonField.value}
        </p>
      )
    case 'Number':
      return (
        <p>
          {props.jsonField.translations.de}: {props.jsonField.value}
        </p>
      )
    case 'Boolean':
      return (
        <p>
          {props.jsonField.translations.de}:&nbsp;{props.jsonField.value ? <Icon icon='tick' /> : <Icon icon='cross' />}
        </p>
      )
    case 'Attachment':
      const attachment = props.jsonField.value
      const downloadUrl = `${props.baseUrl}/file/${attachment.fileIndex}`
      const onClick = async () => {
        const loadingToastKey = appToaster?.show({
          message: `Lade Anhang ${attachment.fileIndex}...`,
          intent: 'primary',
          isCloseButtonShown: false,
        })
        try {
          const result = await fetch(downloadUrl, { headers: { authorization: `Bearer ${props.token}` } })
          const contentType = result.headers.get('content-type')
          if (result.status !== 200) {
            throw Error('Status Code is not OK')
          } else if (contentType === null || !extensionByContentType.has(contentType)) {
            throw Error('Invalid Content Type')
          }
          const filename = `anhang${attachment.fileIndex}.${extensionByContentType.get(contentType)}`
          const arrayBuffer = await result.arrayBuffer()
          const file = new File([arrayBuffer], filename, { type: contentType })
          downloadDataUri(file, filename)
        } catch (e) {
          console.error(e)
          appToaster?.show({ message: 'Etwas ist schiefgelaufen.', intent: 'danger' })
        } finally {
          if (loadingToastKey !== undefined) appToaster?.dismiss(loadingToastKey)
        }
      }
      return (
        <p>
          {props.jsonField.translations.de}:&nbsp;
          <Button icon='download' onClick={onClick}>{`Anhang ${props.jsonField.value.fileIndex}`}</Button>
        </p>
      )
  }
}

export default JsonFieldView
