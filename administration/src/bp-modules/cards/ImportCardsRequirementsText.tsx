import { Typography } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import { ENTRY_LIMIT, FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

type ImportCardsRequirementsProps = {
  csvHeaders: string[]
  isFreinetFormat: boolean | undefined
}

export const getRequiredHeaders = (projectConfig: ProjectConfig): string[] => [
  projectConfig.card.nameColumnName,
  projectConfig.card.expiryColumnName,
  ...projectConfig.card.extensions.flatMap((extension, index) => {
    const header = projectConfig.card.extensionColumnNames[index]
    return extension.isMandatory && header !== null ? [header] : []
  }),
]

const ImportCardsRequirementsText = ({
  csvHeaders,
  isFreinetFormat = false,
}: ImportCardsRequirementsProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')
  const decoratedHeaders = csvHeaders.map(header =>
    getRequiredHeaders(projectConfig).includes(header) ? `${header}*` : header
  )

  return (
    <Typography color='textDisabled' variant='body1' component='ul' paddingLeft={2.5} sx={{ textAlign: 'left' }}>
      <Typography component='li'>{t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })} </Typography>
      <Typography component='li'>{t('fileFormatCSV')} </Typography>
      <Typography component='li'>
        {t('maxNumberOfEntries')}: {ENTRY_LIMIT}
      </Typography>
      <Typography component='li'>
        {isFreinetFormat ? t('minColumnsForFreinet') : `${t('columnFormat')}:  ${decoratedHeaders.join(', ')}`}{' '}
      </Typography>
      <Typography component='li'>{t('dateFormatHint')} </Typography>
    </Typography>
  )
}

export default ImportCardsRequirementsText
