import { Button, Icon } from '@blueprintjs/core'
import React, { useContext } from 'react'
import styled from 'styled-components'

import { AuthContext } from '../../AuthProvider'
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
    background-color: ${props => (props.$hierarchyIndex % 2 === 1 ? 'rgba(0,0,0,5%)' : 'white')};
  }

  & > div {
    padding-left: 10px;
    border-left: 1px solid;
    border-color: inherit;
  }
`

const PrintAwareButton = styled(Button)`
  @media print {
    display: none;
  }
`

const PrintOnlySpan = styled.span`
  @media not print {
    display: none;
  }
`

const JsonFieldView = (props: {
  jsonField: GeneralJsonField
  baseUrl: string
  hierarchyIndex: number
  attachmentAccessible: boolean
}) => {
  const appToaster = useAppToaster()
  const token = useContext(AuthContext).data?.token

  switch (props.jsonField.type) {
    case 'Array':
      const children = props.jsonField.value.map((jsonField: GeneralJsonField, index: number) => (
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={props.baseUrl}
          key={index}
          hierarchyIndex={props.hierarchyIndex + 1}
          attachmentAccessible={props.attachmentAccessible}
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
          message: `Lade Anhang ${attachment.fileIndex + 1}...`,
          intent: 'primary',
          isCloseButtonShown: false,
        })
        try {
          const result = await fetch(downloadUrl, { headers: { authorization: `Bearer ${token}` } })
          const contentType = result.headers.get('content-type')
          if (result.status !== 200) {
            throw Error('Status Code is not OK')
          } else if (contentType === null || !extensionByContentType.has(contentType)) {
            throw Error('Invalid Content Type')
          }
          const filename = `anhang${attachment.fileIndex + 1}.${extensionByContentType.get(contentType)}`
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
          {props.attachmentAccessible ? (
            <>
              <PrintAwareButton icon='download' onClick={onClick}>{`Anhang ${
                props.jsonField.value.fileIndex + 1
              }`}</PrintAwareButton>
              <PrintOnlySpan>{`(siehe Anhang ${props.jsonField.value.fileIndex + 1})`}</PrintOnlySpan>
            </>
          ) : (
            <span>eingereicht, nicht sichtbar</span>
          )}
        </p>
      )
  }
}

export default JsonFieldView
