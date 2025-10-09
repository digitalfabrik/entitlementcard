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
    <Typography component='ul' paddingLeft={3} sx={{ textAlign: 'left' }}>
      <Typography component='li' variant='body2'>
        {t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })}{' '}
      </Typography>
      <Typography component='li' variant='body2'>
        {t('fileFormat')}{' '}
      </Typography>
      <Typography component='li' variant='body2'>
        {t('neededColumns')} {headers.join(', ')}
      </Typography>
    </Typography>
  )
}

export default StoresRequirementsText
