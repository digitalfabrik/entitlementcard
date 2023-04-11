import { Button, Icon } from '@blueprintjs/core'
import React from 'react'
import styled from 'styled-components'

interface Props {
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

const AddEakButton = (props: Props) => (
  <StyledButton icon={<Icon style={{ margin: 10 }} icon={'add'} iconSize={20} />} onClick={props.onClick}>
    Karte hinzufügen
  </StyledButton>
)

export default AddEakButton
