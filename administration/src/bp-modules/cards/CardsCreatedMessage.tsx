import { Button, Icon } from '@blueprintjs/core'
import React from 'react'
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

interface Props {
  reset: () => void
}

const CardsCreatedMessage = (props: Props) => {
  return (
    <Container>
      <Icon icon='tick-circle' color='green' iconSize={100} />
      <p>Die Karten wurden erstellt.</p>
      <Button onClick={props.reset}>Mehr Karten erstellen</Button>
    </Container>
  )
}
export default CardsCreatedMessage
