import { Box } from '@mui/material'
import { ReactElement } from 'react'

type CharacterCounterProps = {
  text: string
  maxChars: number
}

const CharacterCounter = ({ text, maxChars }: CharacterCounterProps): ReactElement => (
  <Box
    sx={theme => ({
      color: text.length > maxChars ? theme.palette.error.main : theme.palette.text.secondary,
      fontSize: theme.typography.body2.fontSize,
      alignSelf: 'center',
    })}
    aria-label='Character Counter'
  >
    {text.length}/{maxChars}
  </Box>
)

export default CharacterCounter
