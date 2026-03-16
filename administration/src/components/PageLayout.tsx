import { Stack, StackProps } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'

import Footer from './Footer'

type PageLayoutProps = StackProps & {
  children: ReactNode
  containerSx?: StackProps['sx']
  showDataPrivacy?: boolean
}

const PageLayout = ({
  children,
  showDataPrivacy,
  containerSx,
  ...stackProps
}: PageLayoutProps): ReactElement => (
  <Stack
    sx={{
      minHeight: '100vh',
      ...stackProps.sx,
    }}
    {...stackProps}
  >
    <Stack sx={{ flexGrow: 1, ...containerSx }}>{children}</Stack>
    <Footer showDataPrivacy={showDataPrivacy} />
  </Stack>
)

export default PageLayout
