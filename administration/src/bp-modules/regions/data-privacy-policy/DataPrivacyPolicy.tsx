import { Stack, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'

const DataPrivacyPolicy = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  return (
    <Stack maxWidth='750px' margin={1} alignSelf='center'>
      <Typography variant='h4'>{config.dataPrivacyHeadline}</Typography>
      <config.dataPrivacyContent />
      {config.dataPrivacyAdditionalBaseContent && <config.dataPrivacyAdditionalBaseContent />}
    </Stack>
  )
}

export default DataPrivacyPolicy
