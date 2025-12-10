/* eslint-disable react/destructuring-assignment */
import { Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import React, { ReactElement, useState } from 'react'

export type MenuItemType = {
  name: string
  onClick: () => void
  icon: ReactElement
}

type BaseMenuProps = {
  menuItems: MenuItemType[]
  variant: 'IconButton' | 'Button'
  openIcon: ReactElement
  closeIcon: ReactElement
  menuLabel?: string
}

const BaseMenu = (props: BaseMenuProps): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (onMenuItemClick: () => void) => {
    onMenuItemClick()
    handleMenuClose()
  }

  return (
    <>
      {props.variant === 'Button' && (
        <Button
          aria-controls={open ? 'base-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          variant='contained'
          onClick={handleMenuOpen}
          endIcon={open ? props.openIcon : props.closeIcon}
          sx={{
            justifyContent: 'space-between',
          }}
        >
          {props.menuLabel}
        </Button>
      )}

      {props.variant === 'IconButton' && (
        <IconButton
          aria-controls={open ? 'base-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          aria-label={props.menuLabel}
          onClick={handleMenuOpen}
          sx={{
            justifyContent: 'space-between',
          }}
        >
          {props.openIcon}
        </IconButton>
      )}

      <Menu
        id='base-menu'
        anchorEl={anchorEl}
        sx={{ marginTop: 1 }}
        slotProps={{ list: { sx: { padding: 0 } } }}
        open={open}
        onClose={handleMenuClose}
      >
        {props.menuItems.map(menuItem => (
          <MenuItem
            key={menuItem.name}
            sx={{ marginY: 0.5 }}
            onClick={() => handleMenuItemClick(menuItem.onClick)}
            disableRipple
          >
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText
              slotProps={{ primary: { typography: 'button', color: 'textSecondary', margin: 0 } }}
            >
              {menuItem.name}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default BaseMenu
