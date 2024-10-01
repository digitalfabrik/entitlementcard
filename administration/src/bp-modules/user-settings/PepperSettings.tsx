import { Callout } from '@blueprintjs/core'
import React from 'react'
import styled from 'styled-components'

import { useGetHashingPepperQuery } from '../../generated/graphql'
import PasswordInput from '../PasswordInput'
import getQueryResult from '../util/getQueryResult'

const Container = styled.div`
  padding: 10px 0;
`

const PepperSettings = () => {
  const errorComponent = (
    <Callout intent='danger'>
      Es ist kein Koblenz Pepper hinterlegt. Das Feature ist in dieser Umgebung aktuell nicht verfügbar!
    </Callout>
  )
  const pepperQuery = useGetHashingPepperQuery()
  const result = getQueryResult(pepperQuery, errorComponent)
  if (!result.successful) return result.component
  return <PepperSettingsView pepper={result.data.pepper} />
}

const PepperSettingsView = ({ pepper }: { pepper: string }) => {
  return (
    <Container>
      <p>Um den Endpunkt zu nutzen, müssen die Nutzerdaten mit folgenden Pepper gehashet werden:</p>
      <PasswordInput label='' value={pepper} setValue={() => {}} />
    </Container>
  )
}

export default PepperSettings
