import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import { ENTRY_LIMIT, FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

const RequirementsList = styled.ul`
  text-align: left;
  padding-left: 20px;
`

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
    <RequirementsList>
      <li>{t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })}</li>
      <li>{t('fileFormatCSV')}</li>
      <li>
        {t('maxNumberOfEntries')}: {ENTRY_LIMIT}
      </li>
      <li>{isFreinetFormat ? t('minColumnsForFreinet') : `${t('columnFormat')}:  ${decoratedHeaders.join(', ')}`}</li>
      <li>{t('dateFormatHint')}</li>
    </RequirementsList>
  )
}

export default ImportCardsRequirementsText
