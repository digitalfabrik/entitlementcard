import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import type { StoresFieldConfig } from '../../../../project-configs'
import { FIELD_LATITUDE, FIELD_LONGITUDE } from '../../../../project-configs/storesManagementConfig'
import { FILE_SIZE_LIMIT_MEGA_BYTES } from '../constants'

type ImportCardsRequirementsProps = {
  header: StoresFieldConfig[]
}

const StoresRequirementsText = ({ header }: ImportCardsRequirementsProps): ReactElement => {
  const headers = header
    // Long/Lat is only required for the import not for the csv file, since it will be resolved by location
    .filter(field => ![FIELD_LATITUDE, FIELD_LONGITUDE].includes(field.name))
    .map(field => (field.isMandatory ? `${field.name}*` : `${field.name}`))
  const { t } = useTranslation('stores')
  return (
    <Typography
      color='textDisabled'
      variant='body1'
      component='ul'
      sx={{ textAlign: 'left', paddingLeft: 3 }}
    >
      <Typography component='li'>
        {t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })}{' '}
      </Typography>
      <Typography component='li'>{t('fileFormat')} </Typography>
      <Typography component='li'>
        {t('neededColumns')} {headers.join(', ')}
      </Typography>
    </Typography>
  )
}

export default StoresRequirementsText
