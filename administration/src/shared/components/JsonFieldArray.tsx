import { Classes, Collapse, Icon } from '@blueprintjs/core'
import { Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import JsonFieldView from './JsonFieldView'
import type { JsonField, JsonFieldViewProps } from './JsonFieldView'

const ParentOfBorder = styled.div<{ $hierarchyIndex: number }>`
  border-color: #ddd;
  transition: 0.2s;

  & > div {
    padding-left: 10px;
    border-left: 1px solid;
    border-color: inherit;
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
      <Typography
        variant='body2bold'
        margin={0}
        padding={0.5}
        sx={{
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        component='h6'
        onClick={() => setIsExpanded(!isExpanded)}>
        <PrintableCaret icon={isExpanded ? 'caret-up' : 'caret-down'} />
        {t(getTranslationKey())}
      </Typography>
      <PrintableCollapse keepChildrenMounted isOpen={isExpanded}>
        {children}
      </PrintableCollapse>
    </ParentOfBorder>
  )
}

export default memo(JsonFieldArray)
