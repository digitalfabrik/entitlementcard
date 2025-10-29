import { Box, styled } from '@mui/system'

import dimensions from './constants/dimensions'

const ButtonBar = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  background: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '& button': {
    marginRight: theme.spacing(1),
  },
  height: dimensions.bottomBarHeight,
}))

export default ButtonBar
