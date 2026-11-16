import { Box, Button, Card, Stack, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode, SubmitEvent } from 'react'

const SettingsCard = ({
  children,
  title,
  action,
}: PropsWithChildren<{
  title: string
  action?: {
    label: string
    onSubmit: () => void
    loading?: boolean
    disabled?: boolean
  }
}>): ReactNode => (
  <Box
    component={action === undefined ? 'section' : 'form'}
    onSubmit={
      action === undefined
        ? undefined
        : (event: SubmitEvent) => {
            event.preventDefault()
            action.onSubmit()
          }
    }
    sx={{ padding: 3 }}
  >
    <Typography variant='h4' component='h2' sx={{ marginBottom: 2 }}>
      {title}
    </Typography>
    <Stack direction='row' sx={{ alignItems: 'flex-end', gap: 8 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      {action !== undefined && (
        <Button
          type='submit'
          loading={action.loading}
          disabled={action.disabled}
          sx={{ flexShrink: 0 }}
        >
          {action.label}
        </Button>
      )}
    </Stack>
  </Box>
)

export const SettingsCardGroup = ({ children }: PropsWithChildren): ReactNode => (
  <Card
    elevation={1}
    sx={{
      width: '100%',
      border: 1,
      borderColor: 'divider',
      maxWidth: 'md',
      marginTop: 2,
      flexShrink: 0,
      '& > *:not(:last-child)': {
        borderBottom: 2,
        borderColor: 'divider',
      },
    }}
  >
    {children}
  </Card>
)

export default SettingsCard
