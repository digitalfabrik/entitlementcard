import { Icon, IconProps } from '@mui/material'
import React, { ReactElement } from 'react'

import csvImage from '../assets/icons/csv.svg'

export const CsvIcon = (p: IconProps): ReactElement => (
  <Icon {...p}>
    <img src={csvImage} alt='CSV file icon' />
  </Icon>
)
