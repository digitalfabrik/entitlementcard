import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { styled } from '@mui/material'
import React, { ReactElement } from 'react'

import { ActionButton } from './components/ActionButton'
import { IconTextButton } from './components/IconTextButton'
import { InfoText } from './components/InfoText'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

type CardSelfServiceActivationProps = {
  deepLink: string
  downloadPdf: () => Promise<void>
}

const CardSelfServiceActivation = ({ deepLink, downloadPdf }: CardSelfServiceActivationProps): ReactElement => (
  <Container>
    <IconTextButton onClick={downloadPdf}>
      <FileDownloadOutlinedIcon />
      AntragsPDF herunterladen
    </IconTextButton>
    <InfoText>Um Ihren Pass zu aktivieren, klicken Sie bitte hier:</InfoText>
    <ActionButton href={deepLink} variant='contained' size='large'>
      Pass aktivieren
    </ActionButton>
  </Container>
)

export default CardSelfServiceActivation
