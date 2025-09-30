import { Box, Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router'

import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'
import { clearActivityLog } from '../activity-log/ActivityLog'

const ProjectSwitcher = (): ReactElement | null => {
  const navigate = useNavigate()
  const switchProject = (project: string) => {
    window.localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, project)
    // This is needed for local development, because activity log entries may have a different format per project
    clearActivityLog()
    navigate(0)
  }

  return process.env.NODE_ENV === 'development' ? (
    <Box sx={{ marginTop: 2 }}>
      <Button variant='text' onClick={() => switchProject('koblenz.sozialpass.app')}>
        Switch to Koblenz
      </Button>
      <Button variant='text' onClick={() => switchProject('nuernberg.sozialpass.app')}>
        Switch to Nürnberg
      </Button>
      <Button variant='text' onClick={() => switchProject('bayern.ehrenamtskarte.app')}>
        Switch to Ehrenamtskarte Bayern
      </Button>
    </Box>
  ) : null
}

export default ProjectSwitcher
