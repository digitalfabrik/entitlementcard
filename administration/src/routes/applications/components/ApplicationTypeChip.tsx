import { Repeat } from '@mui/icons-material'
import { Chip, alpha } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ApplicationType } from '../../../graphql'
import { CircledOneIcon } from '../../../icons/CircledOneIcon'

const applicationTypeChipMetaData: Record<
  ApplicationType,
  { i18nKey: string; icon: ReactElement; color: 'default' | 'primary' }
> = {
  [ApplicationType.FirstApplication]: {
    i18nKey: 'firstApplication',
    icon: <CircledOneIcon />,
    color: 'default',
  },
  [ApplicationType.RenewalApplication]: {
    i18nKey: 'renewalApplication',
    icon: <Repeat />,
    color: 'primary',
  },
}

export const ApplicationTypeChip = ({
  applicationType,
}: {
  applicationType: ApplicationType
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  const { i18nKey, icon, color } = applicationTypeChipMetaData[applicationType]

  return (
    <Chip
      size='small'
      variant='outlined'
      icon={icon}
      color={color}
      label={t(i18nKey)}
      sx={theme => ({
        alignSelf: 'center',
        height: 24,
        padding: theme.spacing(0, 1),
        gap: theme.spacing(0.5),
        '& .MuiChip-icon': { margin: 0 },
        '& .MuiChip-label': { padding: 0 },
        backgroundColor:
          color === 'primary' ? alpha(theme.palette.primary.main, 0.08) : theme.palette.grey[100],
      })}
    />
  )
}
