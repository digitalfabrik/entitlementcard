import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button, styled } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateCardsResult } from '../../cards/createCards'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import getCustomDeepLinkFromQrCode from '../../util/getCustomDeepLinkFromQrCode'
import { IconTextButton } from './components/IconTextButton'
import { InfoText } from './components/InfoText'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

const StyledIconTextButton = styled(IconTextButton)`
  color: #131314;
`

type CardSelfServiceActivationProps = {
  code: CreateCardsResult
  downloadPdf: (code: CreateCardsResult, fileName: string) => Promise<void>
}

const CardSelfServiceActivation = ({ code, downloadPdf }: CardSelfServiceActivationProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('selfService')
  const deepLink = getCustomDeepLinkFromQrCode(projectConfig, {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  })

  return (
    <Container>
      <StyledIconTextButton onClick={() => downloadPdf(code, `${projectConfig.name}.pdf`)}>
        <FileDownloadOutlinedIcon />
        {t('koblenzPassPdf')}
      </StyledIconTextButton>
      <InfoText>
        {t('howToActivateHint')} <br />
        <br />
        <b>{t('important')}: </b>
        {t('koblenzPassAppNeedsToBeInstalled')}
      </InfoText>
      <Button color='secondary' href={deepLink} variant='contained' size='large'>
        {t('activatePass')}
      </Button>
    </Container>
  )
}

export default CardSelfServiceActivation
