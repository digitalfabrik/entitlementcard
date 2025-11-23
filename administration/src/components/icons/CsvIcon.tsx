import { SvgIcon, SvgIconProps } from '@mui/material'
import { ReactElement } from 'react'

import CsvImage from '../../assets/icons/csv.svg'

export const CsvIcon = (p: SvgIconProps): ReactElement => (
  <SvgIcon {...p}>
    <CsvImage />
  </SvgIcon>
)
