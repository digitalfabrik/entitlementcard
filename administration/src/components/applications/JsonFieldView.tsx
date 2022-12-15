import React from 'react'
import { Button, Icon } from '@blueprintjs/core'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import styled from 'styled-components'

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
  Date: string
}

const extensionByContentType = new Map([
  ['application/pdf', 'pdf'],
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
])

const ParentOfBorder = styled.div<{ $hierarchyIndex: number }>`
  border-color: #ddd;
  transition: 0.2s;
  &:hover {
    border-color: #999;
    background-color: ${props => (props.$hierarchyIndex % 2 === 0 ? 'rgba(0,0,0,5%)' : 'white')};
  }

  & > div {
    padding-left: 10px;
    border-left: 1px solid;
    border-color: inherit;
  }
`

const JsonFieldView = (props: {
  jsonField: GeneralJsonField
  baseUrl: string
  token: string
  hierarchyIndex: number
}) => {
  const appToaster = useAppToaster()
  switch (props.jsonField.type) {
    case 'Array':
      const children = props.jsonField.value.map((jsonField: GeneralJsonField, index: number) => (
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={props.baseUrl}
          token={props.token}
          key={index}
          hierarchyIndex={props.hierarchyIndex + 1}
        />
      ))
      return props.jsonField.translations.de.length === 0 ? (
        <>{children}</>
      ) : (
        <ParentOfBorder $hierarchyIndex={props.hierarchyIndex}>
          <p>
            <b>{props.jsonField.translations.de}</b>
          </p>
          <div>{children}</div>
        </ParentOfBorder>
      )
    case 'String':
      return (
        <p>
          {props.jsonField.translations.de}: {props.jsonField.value}
        </p>
      )
    case 'Date':
      return (
        <p>
          {props.jsonField.translations.de}: {new Date(props.jsonField.value).toLocaleDateString('de')}
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
          {props.jsonField.translations.de}:&nbsp;
          {props.jsonField.value ? (
            <>
              <Icon icon='tick' /> Ja
            </>
          ) : (
            <>
              <Icon icon='cross' /> Nein
            </>
          )}
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
