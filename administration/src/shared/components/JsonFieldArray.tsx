import { Classes, Collapse, H6, Icon } from '@blueprintjs/core'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import JsonFieldView from './JsonFieldView'
import type { JsonField, JsonFieldViewProps } from './JsonFieldView'

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
  margin-bottom: 0;
  &:hover {
    cursor: pointer;
  }
`

const PrintableCaret = styled(Icon)`
  @media print {
    display: none;
  }
`

const PrintableCollapse = styled(Collapse)`
  @media print {
    height: auto !important;
    overflow-y: visible !important;

    .${Classes.COLLAPSE_BODY} {
      display: block !important;
      transform: none !important;
    }
  }
`

const JsonFieldArray = ({
  jsonField,
  baseUrl,
  hierarchyIndex,
  attachmentAccessible,
  expandedRoot,
}: JsonFieldViewProps<JsonField<'Array'>>) => {
  const { t } = useTranslation('application')
  const [isExpanded, setIsExpanded] = useState(hierarchyIndex !== 1 || expandedRoot)
  const getTranslationKey = () =>
    [
      'organizationContact',
      'organization',
      'volunteerServiceEntitlement',
      'goldenCardHonoredByMinisterPresidentEntitlement',
    ].includes(jsonField.name)
      ? `${jsonField.name}.title`
      : jsonField.name

  const children = jsonField.value.map((jsonFieldIt, index: number) => (
    <JsonFieldView
      jsonField={jsonFieldIt}
      parentName={
        [
          'organizationContact',
          'organization',
          'volunteerServiceEntitlement',
          'goldenCardHonoredByMinisterPresidentEntitlement',
        ].includes(jsonField.name)
          ? jsonField.name
          : undefined
      }
      baseUrl={baseUrl}
      // This is the best key we have as jsonField.name is not unique
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      hierarchyIndex={hierarchyIndex + 1}
      attachmentAccessible={attachmentAccessible}
      expandedRoot={expandedRoot}
    />
  ))
  return jsonField.name === 'application' ? (
    <>{children}</>
  ) : (
    <ParentOfBorder $hierarchyIndex={hierarchyIndex}>
      <CollapsableHeader onClick={() => setIsExpanded(!isExpanded)}>
        <PrintableCaret icon={isExpanded ? 'caret-up' : 'caret-down'} />
        {t(getTranslationKey())}
      </CollapsableHeader>
      <PrintableCollapse keepChildrenMounted isOpen={isExpanded}>
        {children}
      </PrintableCollapse>
    </ParentOfBorder>
  )
}

export default memo(JsonFieldArray)
