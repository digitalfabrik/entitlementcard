import { EditNote, PrintOutlined } from '@mui/icons-material'
import { fireEvent, render, waitFor } from '@testing-library/react'

import BaseMenu from '../BaseMenu'

describe('BaseMenu', () => {
  const mockMenuItems = [
    {
      name: 'Print PDF',
      onClick: jest.fn(),
      icon: <PrintOutlined />,
    },
    {
      name: 'Edit Note',
      onClick: jest.fn(),
      icon: <EditNote />,
    },
  ]

  const defaultProps = {
    menuLabel: 'Test Menu',
    menuItems: mockMenuItems,
    containerWidth: 200,
    itemHeight: 48,
  }

  it('should render menu button with correct label', () => {
    const { getByRole } = render(<BaseMenu {...defaultProps} />)
    const menuButton = getByRole('button', { name: 'Test Menu' })

    expect(menuButton).toBeTruthy()
  })

  it('should open menu when button is clicked', () => {
    const { getByRole } = render(<BaseMenu {...defaultProps} />)
    const menuButton = getByRole('button', { name: 'Test Menu' })

    fireEvent.click(menuButton)
    const menu = getByRole('menu')

    expect(menu).toBeTruthy()
  })

  it('should render all menu items when the menu is open', () => {
    const { getByRole, getByText } = render(<BaseMenu {...defaultProps} />)
    const menuButton = getByRole('button', { name: 'Test Menu' })

    fireEvent.click(menuButton)

    expect(getByText(mockMenuItems[0].name)).toBeTruthy()
    expect(getByText(mockMenuItems[1].name)).toBeTruthy()
  })

  it('should call onClick handler when menu item is clicked', () => {
    const { getByRole, getByText } = render(<BaseMenu {...defaultProps} />)
    const menuButton = getByRole('button', { name: 'Test Menu' })

    fireEvent.click(menuButton)
    const menuItem = getByText('Print PDF')
    fireEvent.click(menuItem)

    expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1)
  })

  it('should close menu after clicking menu item', async () => {
    const { getByRole, getByText, queryByRole } = render(<BaseMenu {...defaultProps} />)
    const menuButton = getByRole('button', { name: 'Test Menu' })
    fireEvent.click(menuButton)
    const menuItem = getByText('Print PDF')
    fireEvent.click(menuItem)
    // MUI popover has some transition which we have to wait for when closing menu
    await waitFor(() => {
      const menu = queryByRole('menu')
      expect(menu).toBeNull()
    })
  })
})
