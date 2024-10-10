import { Button, Icon } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  & > * {
    margin: 20px;
  }
`

type Props = {
  reset: () => void
}

const CardsCreatedMessage = ({ reset }: Props): ReactElement => (
  <Container>
    <Icon icon='tick-circle' color='green' iconSize={100} />
    <p>Die Karten wurden erstellt.</p>
    <Button onClick={reset}>Mehr Karten erstellen</Button>
  </Container>
)
export default CardsCreatedMessage
