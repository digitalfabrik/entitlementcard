import { SvgIcon, SvgIconProps } from '@mui/material'
import { ReactElement } from 'react'

/** A filled circle with the digit 1 cut out, like the `LooksOne` icon but round. */
export const CircledOneIcon = (p: SvgIconProps): ReactElement => (
  <SvgIcon {...p} viewBox='0 0 24 24'>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m2 15h-2V9h-2V7h4z'
    />
  </SvgIcon>
)
