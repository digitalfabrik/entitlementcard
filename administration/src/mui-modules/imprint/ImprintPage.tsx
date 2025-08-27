import { Card, Typography } from '@mui/material'
import parse from 'html-react-parser'
import React, { ReactElement, useContext } from 'react'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const ImprintPage = (): ReactElement => {
  const { publisherText } = useContext(ProjectConfigContext)
  return (
    <Card sx={{ margin: 'auto', padding: 4, overflow: 'auto', maxWidth: '900' }}>
      <Typography variant='h1' sx={{ fontSize: 28, fontWeight: 500, marginBottom: 4 }}>
        Impressum
      </Typography>
      {parse(publisherText)}
    </Card>
  )
}

export default ImprintPage
