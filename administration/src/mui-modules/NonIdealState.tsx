import { Container, Stack, Typography, useTheme } from '@mui/material'
import React, { ReactElement } from 'react'

const NonIdealState = ({
  title,
  icon,
  description,
}: {
  title: string
  icon: ReactElement
  description: string
}): ReactElement => {
  const theme = useTheme()

  return (
    <Container sx={{ color: theme.palette.text.disabled }} maxWidth='sm'>
      <Stack alignItems='center' gap={2}>
        {icon}
        <Typography variant='h4'>{title}</Typography>
        {description}
      </Stack>
    </Container>
  )
}

export default NonIdealState
