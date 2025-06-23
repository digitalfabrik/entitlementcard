import React, { ReactElement, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ENTRY_LIMIT, FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

const RequirementsList = styled.ul`
  text-align: left;
  padding-left: 20px;
`

type ImportCardsRequirementsProps = {
  csvHeaders: string[]
  isFreinetFormat: boolean | undefined
}

const ImportCardsRequirementsText = ({
  csvHeaders,
  isFreinetFormat = false,
}: ImportCardsRequirementsProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { card: cardConfig } = projectConfig
  const { t } = useTranslation('cards')

  const requiredHeaders = useMemo(() => {
    const headers = [cardConfig.nameColumnName, cardConfig.expiryColumnName]
    cardConfig.extensions.forEach((extension, index) => {
      const header = cardConfig.extensionColumnNames[index]
      if (extension.isMandatory && header) {
        headers.push(header)
      }
    })
    return headers
  }, [cardConfig])

  const decoratedHeaders = csvHeaders.map(header => (requiredHeaders.includes(header) ? `${header}*` : header))

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
