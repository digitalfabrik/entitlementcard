import { Button } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'

const ProjectSwitcher = (): ReactElement | null => {
  const navigate = useNavigate()
  const switchProject = (project: string) => {
    window.localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, project)
    navigate(0)
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  return (
    <>
      <Button onClick={() => switchProject('koblenz.sozialpass.app')}>Switch to Koblenz</Button>
      <Button onClick={() => switchProject('nuernberg.sozialpass.app')}>Switch to Nürnberg</Button>
      <Button onClick={() => switchProject('bayern.ehrenamtskarte.app')}>Switch to Ehrenamtskarte Bayern</Button>
    </>
  )
}

export default ProjectSwitcher
