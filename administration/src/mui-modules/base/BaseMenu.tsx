/* eslint-disable react/destructuring-assignment */
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { ReactElement, useState } from 'react'
import * as React from 'react'

export type MenuItemType = {
  name: string
  onClick: () => void
  icon: ReactElement
}

type BaseMenuProps = {
  menuLabel: string
  menuItems: MenuItemType[]
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
      <Button
        aria-controls={open ? 'base-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        onClick={handleMenuOpen}
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        sx={{
          justifyContent: 'space-between',
        }}>
        {props.menuLabel}
      </Button>

      <Menu
        id='base-menu'
        anchorEl={anchorEl}
        sx={{ marginTop: 1 }}
        slotProps={{ list: { sx: { padding: 0 } } }}
        open={open}
        onClose={handleMenuClose}>
        {props.menuItems.map(menuItem => (
          <MenuItem
            key={menuItem.name}
            sx={{ marginY: 0.5 }}
            onClick={() => handleMenuItemClick(menuItem.onClick)}
            disableRipple>
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText slotProps={{ primary: { typography: 'button', color: 'textSecondary', margin: 0 } }}>
              {menuItem.name}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default BaseMenu
