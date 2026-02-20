import { Card, Typography } from '@mui/material'
import parse from 'html-react-parser'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectConfigContext } from '../../provider/ProjectConfigContext'

const ImprintPage = (): ReactElement => {
  const { t } = useTranslation('misc')
  const { publisherText } = useContext(ProjectConfigContext)
  return (
    <Card sx={{ margin: 'auto', padding: 4, overflow: 'auto', maxWidth: '900' }}>
      <Typography variant='h4' component='h1' marginBottom={4}>
        {t('imprint')}
      </Typography>
      {parse(publisherText)}
    </Card>
  )
}

export default ImprintPage
