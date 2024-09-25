import { Icon } from '@blueprintjs/core'
import { Button, styled } from '@mui/material'
import React, { ReactElement } from 'react'

const StyledButton = styled(Button)`
  display: inline-block;
  background-color: #922224;
  margin-top: 24px;
  width: fit-content;
  :hover {
    color: white;
    background-color: #922224;
  }
`

const Text = styled('div')`
  margin-bottom: 24px;
  font-size: 16px;
`

const PDFDownloadButton = styled('button')`
  background-color: transparent;
  border: none;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  cursor: pointer;
  font-size: 16px;
`

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

type CardSelfServiceActivationProps = {
  deepLink: string
  downloadPdf: () => Promise<void>
}
const CardSelfServiceActivation = ({ deepLink, downloadPdf }: CardSelfServiceActivationProps): ReactElement => {
  return (
    <Container>
      <PDFDownloadButton onClick={downloadPdf}>
        {' '}
        <Icon icon='download' />
        AntragsPDF herunterladen
      </PDFDownloadButton>
      <Text>Um Ihren Pass zu aktivieren, klicken Sie bitte hier:</Text>
      <StyledButton href={deepLink} variant='contained' size='large'>
        Pass aktivieren
      </StyledButton>
    </Container>
  )
}

export default CardSelfServiceActivation
