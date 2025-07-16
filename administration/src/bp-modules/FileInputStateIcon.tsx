import { Icon, NonIdealStateIconSize } from '@blueprintjs/core'
import { CircularProgress } from '@mui/material'
import React, { ReactElement } from 'react'

export type FileInputStateType = 'loading' | 'error' | 'idle'

const FileInputStateIcon = ({ inputState }: { inputState: FileInputStateType }): ReactElement => {
  if (inputState === 'loading') {
    return <CircularProgress style={{ margin: 'auto' }} />
  }
  if (inputState === 'error') {
    return <Icon intent='danger' size={NonIdealStateIconSize.STANDARD} icon='error' />
  }
  return <Icon intent='warning' size={NonIdealStateIconSize.STANDARD} icon='upload' />
}

export default FileInputStateIcon
