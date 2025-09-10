import { Card } from '@blueprintjs/core'
import styled from 'styled-components'

import dimensions from './constants/dimensions'

const ButtonBar = styled(Card)`
  width: 100%;
  padding: 8px;
  background: #fafafa;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  & button {
    margin-right: 5px;
  }
  height: ${dimensions.bottomBarHeight}px;
`

export default ButtonBar
