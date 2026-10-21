import { Box, Breakpoint, Card, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ReactElement, ReactNode, useContext } from 'react'

import { ProjectConfigContext } from '../provider/ProjectConfigContext'
import PageLayout from './PageLayout'

type PublicPageLayoutProps = {
  children: ReactNode
  maxWidth?: Breakpoint | number
  showDataPrivacy?: boolean
}

const PublicPageLayout = ({
  children,
  maxWidth = 'md',
  showDataPrivacy,
}: PublicPageLayoutProps): ReactElement => {
  const config = useContext(ProjectConfigContext)

  return (
    <PageLayout
      showDataPrivacy={showDataPrivacy}
      containerSx={{ alignItems: 'center', paddingX: { xs: 0, sm: 2 }, paddingY: { xs: 0, sm: 4 } }}
    >
      <Card
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: theme =>
            typeof maxWidth === 'number' ? maxWidth : theme.breakpoints.values[maxWidth],
          marginY: { xs: 0, sm: 'auto' },
          borderRadius: { xs: 0, sm: 1 },
          boxShadow: { xs: 'none', sm: 2 },
        }}
      >
        <Stack
          component='header'
          direction='row'
          sx={{
            alignItems: 'center',
            gap: 3,
            height: 100,
            boxSizing: 'border-box',
            paddingX: 4,
            backgroundColor: grey[100],
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            component='img'
            src={`/icons/${config.projectId}.png`}
            alt=''
            sx={{ height: 56, width: 56, borderRadius: '20%' }}
          />
          <Typography variant='h5' component='h1' sx={{ fontWeight: 'bold', marginBottom: 0 }}>
            {config.name}
          </Typography>
        </Stack>
        <Box sx={{ padding: '20px' }}>{children}</Box>
      </Card>
    </PageLayout>
  )
}

export default PublicPageLayout
