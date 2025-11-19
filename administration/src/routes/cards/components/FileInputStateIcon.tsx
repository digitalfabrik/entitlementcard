import { ArrowCircleUp, Error } from '@mui/icons-material'
import React, { ReactElement } from 'react'

import CenteredCircularProgress from '../../../shared/components/CenteredCircularProgress'

export type FileInputStateType = 'loading' | 'error' | 'idle'

const FileInputStateIcon = ({ inputState }: { inputState: FileInputStateType }): ReactElement => {
  if (inputState === 'loading') {
    return <CenteredCircularProgress />
  }
  if (inputState === 'error') {
    return <Error color='error' sx={{ fontSize: 56 }} />
  }
  return <ArrowCircleUp color='warning' sx={{ fontSize: 56 }} />
}

export default FileInputStateIcon
