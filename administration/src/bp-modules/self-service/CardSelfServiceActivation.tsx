import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateCardsResult } from '../../cards/createCards'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import getCustomDeepLinkFromQrCode from '../../util/getCustomDeepLinkFromQrCode'

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
    <>
      <Button
        color='primary'
        variant='text'
        onClick={() => downloadPdf(code, `${projectConfig.name}.pdf`)}
        sx={theme => ({ width: 'fit-content', color: theme.palette.common.black })}
        startIcon={<FileDownloadOutlinedIcon />}>
        {' '}
        {t('koblenzPassPdf')}
      </Button>
      <Typography variant='body1' marginTop={1.5} marginBottom={3}>
        {t('howToActivateHint')} <br />
        <br />
        <b>{t('important')}: </b>
        {t('koblenzPassAppNeedsToBeInstalled')}
      </Typography>
      <Button color='secondary' href={deepLink} variant='contained' size='large' sx={{ width: 'fit-content' }}>
        {t('activatePass')}
      </Button>
    </>
  )
}

export default CardSelfServiceActivation
