import { grey } from '@mui/material/colors'
import { Box, styled } from '@mui/system'

const ButtonBar = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 1),
  background: grey[100],
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '& button': {
    marginRight: theme.spacing(1),
  },
}))

export default ButtonBar
