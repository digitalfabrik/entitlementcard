import { Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import type { StoresFieldConfig } from '../../project-configs/getProjectConfig'
import { FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

type ImportCardsRequirementsProps = {
  header: StoresFieldConfig[]
}

const StoresRequirementsText = ({ header }: ImportCardsRequirementsProps): ReactElement => {
  const headers = header.map(field => (field.isMandatory ? `${field.name}*` : `${field.name}`))
  const { t } = useTranslation('stores')
  return (
    <Typography color='textDisabled' variant='body1' component='ul' paddingLeft={3} sx={{ textAlign: 'left' }}>
      <Typography component='li'>{t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })} </Typography>
      <Typography component='li'>{t('fileFormat')} </Typography>
      <Typography component='li'>
        {t('neededColumns')} {headers.join(', ')}
      </Typography>
    </Typography>
  )
}

export default StoresRequirementsText
