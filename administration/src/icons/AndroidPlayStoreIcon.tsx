import { Icon, IconProps } from '@mui/material'
import React, { ReactElement } from 'react'

import svgImage from '../assets/android_appstore_icon.svg'

export const AndroidPlayStoreIcon = (p: IconProps): ReactElement => (
  <Icon {...p}>
    <img src={svgImage} alt='Android Play Store icon' />
  </Icon>
)
