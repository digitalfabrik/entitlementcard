import { Box } from '@mui/material'
import React, { ReactElement } from 'react'

type CharacterCounterProps = {
  text: string
  maxChars: number
}

const CharacterCounter = ({ text, maxChars }: CharacterCounterProps): ReactElement => (
  <Box
    sx={theme => ({
      color: text.length > maxChars ? theme.palette.error.main : theme.palette.common.black,
      alignSelf: 'center',
    })}
    aria-label='Character Counter'>
    {text.length}/{maxChars}
  </Box>
)

export default CharacterCounter
