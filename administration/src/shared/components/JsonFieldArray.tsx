import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import JsonFieldView from './JsonFieldView'
import type { JsonField, JsonFieldViewProps } from './JsonFieldView'

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
    <Accordion
      elevation={0}
      disableGutters
      expanded={isExpanded}
      sx={{
        '&::before': {
          display: 'none',
        },
      }}>
      <AccordionSummary sx={{ minHeight: 24, p: 0, '& > span': { m: 0.5 } }} component='div'>
        <Button
          sx={theme => ({ p: 0, color: `${theme.palette.common.black}!important` })}
          size='small'
          startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          variant='text'
          onClick={() => setIsExpanded(!isExpanded)}>
          <Typography variant='body2bold' sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
            {' '}
            {t(getTranslationKey())}
          </Typography>
        </Button>
      </AccordionSummary>
      <AccordionDetails
        sx={theme => ({
          transition: '0.2s',
          padding: 1.5,
          borderLeft: `1px solid ${theme.palette.divider}`,
        })}>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default memo(JsonFieldArray)
