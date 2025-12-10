import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import BaseMenu, { MenuItemType } from '../../../components/BaseMenu'

const TableMenu = ({
  storeId,
  onEditStore,
}: {
  storeId: number
  onEditStore: (storeId: number) => void
}): ReactElement => {
  const { t } = useTranslation('misc')
  const menuItems: MenuItemType[] = [
    {
      name: t('edit'),
      onClick: () => {
        onEditStore(storeId)
      },
      icon: <EditOutlinedIcon sx={{ height: 20 }} />,
    },
  ]
  return (
    <BaseMenu
      menuItems={menuItems}
      variant='IconButton'
      menuLabel={t('stores:storeMenu')}
      openIcon={<MoreVertRoundedIcon />}
      closeIcon={<MoreVertRoundedIcon />}
    />
  )
}
export default TableMenu
