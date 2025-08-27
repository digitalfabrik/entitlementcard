import { Card } from '@blueprintjs/core'
import styled from 'styled-components'

import dimensions from './constants/dimensions'

const ButtonBar = styled(Card)`
  width: 100%;
  padding: 12px;
  background: #fafafa;
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  & button {
    margin: 5px;
  }
  height: ${dimensions.bottomBarHeight}px;
`

export default ButtonBar
