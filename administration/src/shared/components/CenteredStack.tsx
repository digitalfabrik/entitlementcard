import { Stack } from '@mui/material'
import React, { ReactElement } from 'react'

type CenteredStackProps = { children: ReactElement }

const CenteredStack = ({ children }: CenteredStackProps): ReactElement => (
  <Stack sx={{ flexGrow: 1, alignSelf: 'center', justifyContent: 'center', p: 2 }}>{children}</Stack>
)

export default CenteredStack
