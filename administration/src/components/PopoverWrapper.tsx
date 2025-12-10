import { IconButton, Popover } from '@mui/material'
import React, { ReactElement } from 'react'

type PopoverWrapperProps = {
  icon: ReactElement
  children: ReactElement
}

const PopoverWrapper = ({ children, icon }: PopoverWrapperProps): ReactElement => {
  const [anchorElement, setAnchorElement] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <>
      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {children}
      </Popover>
      <IconButton onClick={handleClick}>{icon}</IconButton>
    </>
  )
}

export default PopoverWrapper
