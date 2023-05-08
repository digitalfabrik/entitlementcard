import { Card } from '@blueprintjs/core'
import styled from 'styled-components'

const ButtonBar = styled(Card)`
  width: 100%;
  padding: 15px;
  background: #fafafa;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  & button {
    margin: 5px;
  }
`

export default ButtonBar
