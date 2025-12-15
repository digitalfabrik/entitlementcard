import { Icon, IconProps } from '@mui/material'
import React, { ReactElement } from 'react'

import svgImage from '../assets/koblenz_logo.svg'

export const KoblenzLogo = (p: IconProps): ReactElement => (
  <Icon {...p}>
    <img src={svgImage} alt='Android Play Store icon' />
  </Icon>
)
