import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { PropsWithChildren, ReactNode } from 'react'

export const SettingsCardButtonBox = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  paddingBlock: theme.spacing(1),
}))

type SettingsCardProps = {
  title: string
}

const SettingsCard = ({ children, title }: PropsWithChildren<SettingsCardProps>): ReactNode => (
  <Card sx={{ width: '100%', maxWidth: '500px', padding: 3, display: 'table' }}>
    <Typography variant='h4' component='h2'>
      {title}
    </Typography>
    {children}
  </Card>
)

export default SettingsCard
