import styled from '@emotion/styled'
import { Button, SxProps } from '@mui/material'
import { Theme } from '@mui/system'

// TODO #2362 Set up MUI colors - file will be removed afterwards

export const ActionButton = styled(Button)`
  color: white;
  text-transform: none;
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
export const actionButtonSx: SxProps<Theme> = {
  color: 'white',
  textTransform: 'none',
  backgroundColor: '#922224',
  width: 'fit-content',
  '&:hover': {
    color: 'white',
    backgroundColor: '#922224',
  },
  '&:disabled': {
    backgroundColor: '#d9d9d9',
    color: '#595959',
  },
}
