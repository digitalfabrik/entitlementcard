import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Container = styled.div<{ $hasError: boolean }>`
  align-self: center;
  color: ${props => (props.$hasError ? 'red' : 'black')};
`

type CharacterCounterProps = {
  text: string
  maxChars: number
}

const CharacterCounter = ({ text, maxChars }: CharacterCounterProps): ReactElement => (
  <Container $hasError={text.length > maxChars} aria-label='Character Counter'>
    {text.length}/{maxChars}
  </Container>
)

export default CharacterCounter
