import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { memo, useState } from 'react'
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
      <AccordionSummary
        sx={{ minHeight: 24, p: 0, '& > span': { m: 0.5 }, flexDirection: 'row-reverse' }}
        component='div'
        onClick={() => setIsExpanded(!isExpanded)}
        expandIcon={<ExpandMore sx={theme => ({ color: theme.palette.common.black })} />}>
        <Typography variant='body2bold' sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
          {t(getTranslationKey())}
        </Typography>
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
