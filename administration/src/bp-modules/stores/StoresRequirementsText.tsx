import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import type { StoresFieldConfig } from '../../project-configs/getProjectConfig'
import { FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

const RequirementsList = styled.ul`
  text-align: left;
  padding-left: 20px;
`

type ImportCardsRequirementsProps = {
  header: StoresFieldConfig[]
}

const StoresRequirementsText = ({ header }: ImportCardsRequirementsProps): ReactElement => {
  const headers = header.map(field => (field.isMandatory ? `${field.name}*` : `${field.name}`))
  const { t } = useTranslation('stores')
  return (
    <RequirementsList>
      <li>{t('maxFileSize', { maxFileSize: FILE_SIZE_LIMIT_MEGA_BYTES })} </li>
      <li>{t('fileFormat')}</li>
      <li>
        {t('neededColumns')} {headers.join(', ')}
      </li>
    </RequirementsList>
  )
}

export default StoresRequirementsText
