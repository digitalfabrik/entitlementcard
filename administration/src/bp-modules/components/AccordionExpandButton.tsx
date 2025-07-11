import { ExpandMore } from '@mui/icons-material'
import { Divider, Stack } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export type AccordionExpandButtonProps = {
  expanded: boolean
}

export const AccordionExpandButton = ({ expanded }: AccordionExpandButtonProps): ReactElement => {
  const { t } = useTranslation('shared')

  return (
    <Stack sx={{ displayPrint: 'none' }}>
      <Divider />
      <Stack direction='row' sx={{ p: 1, alignItems: 'center' }}>
        <ExpandMore
          sx={{
            transform: 'rotate(0deg)',
            transition: 'transform 0.3s',
            'button[aria-expanded=true] &': {
              transform: 'rotate(180deg)',
            },
          }}
        />
        &ensp;
        {t(expanded ? 'accordionShowLess' : 'accordionShowMore')}
      </Stack>
    </Stack>
  )
}
