import { Button, Icon, IconName } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

type Props = {
  text: string
  icon: IconName
  onClick: () => void
  disabled?: boolean
}

const StyledButton = styled(Button)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transition: 0.2s background;
  background: white;

  :hover {
    background: #f0f0f0;
  }
`

const CardFormButton = ({ text, icon, onClick, disabled = false }: Props): ReactElement => (
  <StyledButton icon={<Icon style={{ margin: 10 }} icon={icon} iconSize={20} />} onClick={onClick} disabled={disabled}>
    {text}
  </StyledButton>
)

export default CardFormButton
