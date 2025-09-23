import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ErrorIcon from '@mui/icons-material/Error'
import React, { ReactElement } from 'react'

import CenteredCircularProgress from '../mui-modules/base/CenteredCircularProgress'

export type FileInputStateType = 'loading' | 'error' | 'idle'

const FileInputStateIcon = ({ inputState }: { inputState: FileInputStateType }): ReactElement => {
  if (inputState === 'loading') {
    return <CenteredCircularProgress />
  }
  if (inputState === 'error') {
    return <ErrorIcon color='error' sx={{ fontSize: 48 }} />
  }
  return <CloudUploadIcon color='warning' sx={{ fontSize: 48 }} />
}

export default FileInputStateIcon
