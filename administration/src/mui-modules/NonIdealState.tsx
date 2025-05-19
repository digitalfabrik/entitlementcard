import { Container, Stack, Typography, useTheme } from '@mui/material'
import React, { ReactElement } from 'react'

/* eslint-disable react/destructuring-assignment */

const NonIdealState = (p: { title: string; icon: ReactElement; description: string }): ReactElement => {
  const theme = useTheme()

  return (
    <Container sx={{ color: theme.palette.text.disabled }} maxWidth='sm'>
      <Stack alignItems='center' gap={2}>
        {p.icon}
        <Typography variant='h4'>{p.title}</Typography>
        {p.description}
      </Stack>
    </Container>
  )
}

export default NonIdealState
