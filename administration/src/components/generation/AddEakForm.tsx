import React from "react";
import {Card, Icon} from "@blueprintjs/core";
import styled from 'styled-components';

interface Props {
    onClick: () => void
}

const StyledCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  &  p {
    text-align: center;
    margin: 10px 0 0 0;
  }
  :hover {
    background: #f0f0f0;
  }
`

const AddEakForm = (props: Props) => (
    <StyledCard onClick={props.onClick}>
        <Icon icon="add" iconSize={20}/>
        <p>Hinzufügen</p>
    </StyledCard>
);

export default AddEakForm;
