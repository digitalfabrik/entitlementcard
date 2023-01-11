import React, { ReactElement } from 'react'
import styled from 'styled-components'
import {dataPrivacyBaseHeadline, DataPrivacyBaseText} from '../constants/dataPrivacyBase'


const Container = styled.div`
  max-width: 750px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-self: center;
`
const Title = styled.h1`
  margin: 10px;
  text-align: center;
`

const DataPrivacyPolicy = (): ReactElement => (
  <Container>
    <Title>{dataPrivacyBaseHeadline}</Title>
    <DataPrivacyBaseText />
  </Container>
)

export default DataPrivacyPolicy
