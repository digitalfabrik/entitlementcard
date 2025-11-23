import { SxProps, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { ReactElement, ReactNode } from 'react'

type BlankslateProps = {
  icon: ReactElement
  title: string
  description: string | ReactNode
  children: ReactNode
  containerSx?: SxProps
}

const Blankslate = ({ icon, title, description, children, containerSx }: BlankslateProps): ReactElement => (
  <Stack sx={{ alignItems: 'center', gap: 2.5, ...containerSx }}>
    {icon}
    <Typography variant='h5' sx={{ m: 0 }}>
      {title}
    </Typography>
    <Typography variant='body1'>{description}</Typography>
    {children}
  </Stack>
)

export default Blankslate
