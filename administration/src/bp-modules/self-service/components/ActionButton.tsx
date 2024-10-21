import styled from '@emotion/styled'
import { Button } from '@mui/material'

export const ActionButton = styled(Button)`
  background-color: #922224;
  width: fit-content;
  :hover {
    color: white;
    background-color: #922224;
  }
  :disabled {
    background-color: #d9d9d9;
    color: #595959;
  }
`
