import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'

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
  font-size: 1.5rem;
`

const DataPrivacyPolicy = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  return (
    <Container>
      <Title>{config.dataPrivacyHeadline}</Title>
      <config.dataPrivacyContent />
    </Container>
  )
}

export default DataPrivacyPolicy
