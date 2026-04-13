import { Card, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import { ProjectConfigContext } from '../../provider/ProjectConfigContext'

const DataPrivacyPolicy = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  return (
    <Card sx={{ marginX: 'auto', padding: 4, overflow: 'auto', maxWidth: '900px' }}>
      <Typography variant='h4' component='h1' sx={{ mb: 4 }}>
        {config.dataPrivacyHeadline}
      </Typography>
      <config.dataPrivacyContent />
      {config.dataPrivacyAdditionalBaseContent && <config.dataPrivacyAdditionalBaseContent />}
    </Card>
  )
}

export default DataPrivacyPolicy
