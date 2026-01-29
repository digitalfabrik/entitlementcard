import { DeleteOutlineOutlined, EditOutlined, MoreVertRounded } from '@mui/icons-material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import BaseMenu, { MenuItemType } from '../../../components/BaseMenu'

const TableMenu = ({
  storeId,
  onEditStore,
  onDeleteStore,
}: {
  storeId: number
  onEditStore: (storeId: number) => void
  onDeleteStore: (storeId: number) => void
}): ReactElement => {
  const { t } = useTranslation('misc')

  const menuItems: MenuItemType[] = [
    {
      name: t('edit'),
      onClick: () => {
        onEditStore(storeId)
      },
      icon: <EditOutlined sx={{ height: 20 }} />,
    },
    {
      name: t('delete'),
      onClick: () => onDeleteStore(storeId),
      icon: <DeleteOutlineOutlined sx={{ height: 20 }} />,
    },
  ]
  return (
    <BaseMenu
      menuItems={menuItems}
      variant='IconButton'
      menuLabel={t('stores:storeMenu')}
      openIcon={<MoreVertRounded />}
      closeIcon={<MoreVertRounded />}
    />
  )
}
export default TableMenu
