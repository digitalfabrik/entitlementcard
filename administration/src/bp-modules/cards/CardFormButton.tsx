import { Button, Icon, IconName } from '@blueprintjs/core'
import React from 'react'
import styled from 'styled-components'

interface Props {
  text: string
  icon: IconName
  onClick: () => void
}

const StyledButton = styled(Button)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transition: 0.2s background;
  background: white;

  :hover {
    background: #f0f0f0;
  }
`

const CardFormButton = ({ text, icon, onClick }: Props) => (
  <StyledButton icon={<Icon style={{ margin: 10 }} icon={icon} iconSize={20} />} onClick={onClick}>
    {text}
  </StyledButton>
)

export default CardFormButton
