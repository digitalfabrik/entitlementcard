import React from "react";
import {Button, Icon} from "@blueprintjs/core";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface Props {
    reset: () => void
}


const GenerationController = (props: Props) => {
        return (
            <Container>
                <Icon icon="tick-circle" color="green" iconSize={100}/>
                <p>Die Karten wurden erstellt.</p>
                <Button value={"Mehr Karten erstellen"} onClick={props.reset}/>
            </Container>
        );
    }
;

export default GenerationController;
