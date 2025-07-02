/* eslint-disable react/destructuring-assignment */
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Button, Menu, MenuItem, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'

export type MenuItemType = {
  name: string
  onClick: () => void
  icon: ReactElement
}

type BaseMenuProps = {
  menuLabel: string
  menuItems: MenuItemType[]
  containerWidth: number
  itemHeight: number
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
        color='default'
        sx={{
          width: props.containerWidth,
          height: props.itemHeight,
          justifyContent: 'space-between',
          paddingRight: 1,
        }}>
        <Typography variant='button'>{props.menuLabel}</Typography>
        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </Button>

      <Menu
        id='base-menu'
        anchorEl={anchorEl}
        sx={{ marginTop: 1 }}
        slotProps={{ list: { sx: { padding: 0 } } }}
        color='default'
        open={open}
        onClose={handleMenuClose}>
        {props.menuItems.map(menuItem => (
          <MenuItem
            color='default'
            key={menuItem.name}
            onClick={() => handleMenuItemClick(menuItem.onClick)}
            disableRipple
            sx={{
              width: props.containerWidth,
              height: props.itemHeight,
              paddingLeft: 1.5,
            }}>
            {menuItem.icon}
            <Typography variant='button'>{menuItem.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default BaseMenu
