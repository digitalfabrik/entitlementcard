import { Box, BoxProps } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'

import Footer from './Footer'

type PageLayoutProps = BoxProps & {
  children: ReactNode
  showDataPrivacy?: boolean
}

const PageLayout = ({ children, showDataPrivacy, ...boxProps }: PageLayoutProps): ReactElement => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      ...boxProps.sx,
    }}
    {...boxProps}
  >
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>

    <Footer showDataPrivacy={showDataPrivacy} />
  </Box>
)

export default PageLayout
