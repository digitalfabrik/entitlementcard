import { Icon, NonIdealStateIconSize } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import CenteredCircularProgress from '../mui-modules/base/CenteredCircularProgress'

export type FileInputStateType = 'loading' | 'error' | 'idle'

const FileInputStateIcon = ({ inputState }: { inputState: FileInputStateType }): ReactElement => {
  if (inputState === 'loading') {
    return <CenteredCircularProgress />
  }
  if (inputState === 'error') {
    return <Icon intent='danger' size={NonIdealStateIconSize.STANDARD} icon='error' />
  }
  return <Icon intent='warning' size={NonIdealStateIconSize.STANDARD} icon='upload' />
}

export default FileInputStateIcon
