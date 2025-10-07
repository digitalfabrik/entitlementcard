import { Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

import NavigationItems from '../../mui-modules/navigation/NavigationItems'

const HomeController = (): ReactElement => (
  <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 4, gap: 2 }}>
    <Typography variant='h4'>Wählen Sie eine Aktion aus:</Typography>
    <NavigationItems variant='outlined' />
  </Stack>
)

export default HomeController
