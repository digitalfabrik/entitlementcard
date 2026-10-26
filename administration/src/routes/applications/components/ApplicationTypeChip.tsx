import { Repeat } from '@mui/icons-material'
import { Theme, useTheme } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { BaseChip } from '../../../components/BaseChip'
import { ApplicationType } from '../../../graphql'
import { CircledOneIcon } from '../../../icons/CircledOneIcon'

const applicationTypeChipMetaData: Record<
  ApplicationType,
  { i18nKey: string; icon: ReactElement; color: (theme: Theme) => string }
> = {
  [ApplicationType.FirstApplication]: {
    i18nKey: 'firstApplication',
    icon: <CircledOneIcon />,
    color: theme => theme.palette.grey[700],
  },
  [ApplicationType.RenewalApplication]: {
    i18nKey: 'renewalApplication',
    icon: <Repeat />,
    color: theme => theme.palette.primary.main,
  },
}

export const ApplicationTypeChip = ({
  applicationType,
}: {
  applicationType: ApplicationType
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()

  const { i18nKey, icon, color } = applicationTypeChipMetaData[applicationType]

  return <BaseChip label={t(i18nKey)} icon={icon} color={color(theme)} />
}
