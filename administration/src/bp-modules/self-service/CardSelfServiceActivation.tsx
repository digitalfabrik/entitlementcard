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

const StyledIconTextButton = styled(IconTextButton)`
  color: #131314;
`

type CardSelfServiceActivationProps = {
  deepLink: string
  downloadPdf: () => Promise<void>
}

const CardSelfServiceActivation = ({ deepLink, downloadPdf }: CardSelfServiceActivationProps): ReactElement => (
  <Container>
    <StyledIconTextButton onClick={downloadPdf}>
      <FileDownloadOutlinedIcon />
      KoblenzPass PDF
    </StyledIconTextButton>
    <InfoText>
      Um Ihren KoblenzPass auf dem aktuellen Gerät zu aktivieren, klicken Sie bitte auf „Pass jetzt aktivieren“. <br />
      <br />
      <b>Wichtig: </b>Die KoblenzPass-App muss dafür installiert sein (siehe Schritt 2 von 3).
    </InfoText>
    <ActionButton href={deepLink} variant='contained' size='large'>
      KoblenzPass jetzt aktivieren
    </ActionButton>
  </Container>
)

export default CardSelfServiceActivation
