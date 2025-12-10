import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import React, { ReactElement } from 'react'

type ClearInputButtonProps = { viewportSmall: boolean; onClick: () => void; input?: string }

const ClearInputButton = ({
  viewportSmall,
  onClick,
  input,
}: ClearInputButtonProps): ReactElement | null => {
  if (!input || input.length === 0) {
    return null
  }
  return (
    <IconButton sx={{ height: viewportSmall ? 40 : 30 }} onClick={onClick}>
      <CloseIcon fontSize={viewportSmall ? 'medium' : 'small'} />
    </IconButton>
  )
}

export default ClearInputButton
