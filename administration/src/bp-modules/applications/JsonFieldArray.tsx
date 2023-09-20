import { Button, Collapse, H6, Icon } from '@blueprintjs/core'
import { memo, useState } from 'react'
import styled from 'styled-components'

import JsonFieldView from './JsonFieldView'

export type JsonField<T extends keyof JsonFieldValueByType> = {
  name: string
  translations: { de: string }
  type: T
  value: JsonFieldValueByType[T]
}

export type GeneralJsonField = { [K in keyof JsonFieldValueByType]: JsonField<K> }[keyof JsonFieldValueByType]

export type JsonFieldValueByType = {
  Array: GeneralJsonField[]
  String: string
  Number: number
  Boolean: boolean
  Attachment: { fileIndex: number }
  Date: string
}

export const findValue = <T extends keyof JsonFieldValueByType>(
  object: JsonField<'Array'>,
  key: string,
  type: T
): JsonField<T> | undefined => {
  const entry = object.value.find(entry => entry.name === key)
  if (entry?.type === type) {
    return entry as JsonField<typeof type>
  }
  return undefined
}

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

const CollapsableHeader = styled(H6)`
  padding-bottom: 10px;
  margin-bottom: 0%;
  &:hover {
    cursor: pointer;
  }
`

export type JsonFieldViewProps<JsonFieldType extends GeneralJsonField> = {
  jsonField: JsonFieldType
  hierarchyIndex: number
  baseUrl: string
  attachmentAccessible: boolean
}

const JsonFieldArray = ({
  jsonField,
  baseUrl,
  hierarchyIndex,
  attachmentAccessible,
}: JsonFieldViewProps<JsonField<'Array'>>) => {
  const [isExpanded, setIsExpanded] = useState(hierarchyIndex !== 1)
  const children = jsonField.value.map((jsonField, index: number) => (
    <JsonFieldView
      jsonField={jsonField}
      baseUrl={baseUrl}
      key={index}
      hierarchyIndex={hierarchyIndex + 1}
      attachmentAccessible={attachmentAccessible}
    />
  ))
  return jsonField.translations.de.length === 0 ? (
    <>{children}</>
  ) : (
    <ParentOfBorder $hierarchyIndex={hierarchyIndex}>
      <CollapsableHeader onClick={() => setIsExpanded(!isExpanded)}>
        <Icon icon={isExpanded ? 'caret-up' : 'caret-down'} />
        {jsonField.translations.de}
      </CollapsableHeader>
      <Collapse keepChildrenMounted isOpen={isExpanded}>
        {children}
      </Collapse>
    </ParentOfBorder>
  )
}

export default memo(JsonFieldArray)
