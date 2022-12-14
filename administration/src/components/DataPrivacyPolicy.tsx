import { H1 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { dataPrivacyBaseHeadline, dataPrivacyBaseText } from '../constants/dataPrivacyBase'

const Content = styled.div`
  white-space: pre-line;
  margin-top: 2rem;
`
const Container = styled.div`
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-self: center;
`

const DataPrivacyPolicy = (): ReactElement => (
  <Container>
    <H1>{dataPrivacyBaseHeadline}</H1>
    <Content>{dataPrivacyBaseText}</Content>
  </Container>
)

export default DataPrivacyPolicy
