import { Icon, IconProps } from '@mui/material'
import React, { ReactElement } from 'react'

import svgImage from '../assets/ios_appstore_icon.svg'

export const IosAppStoreIcon = (p: IconProps): ReactElement => (
  <Icon {...p}>
    <img src={svgImage} alt='iOS App Store icon' />
  </Icon>
)
