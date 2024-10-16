import { Callout } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useGetHashingPepperQuery } from '../../generated/graphql'
import PasswordInput from '../PasswordInput'
import getQueryResult from '../util/getQueryResult'

const Container = styled.div`
  padding: 10px 0;
`

const PepperSettingsView = ({ pepper }: { pepper: string }) => (
  <Container>
    <p>Um den Endpunkt zu nutzen, müssen die Nutzerdaten mit folgenden Pepper gehasht werden:</p>
    <PasswordInput label='' value={pepper} setValue={null} />
  </Container>
)

const PepperSettings = (): ReactElement => {
  const errorComponent = (
    <Container>
      <Callout intent='danger'>
        Es ist kein Koblenz Pepper hinterlegt. Diese Funktion ist in dieser Umgebung aktuell nicht verfügbar!
      </Callout>
    </Container>
  )
  const pepperQuery = useGetHashingPepperQuery()
  const result = getQueryResult(pepperQuery, errorComponent)
  if (!result.successful) {
    return result.component
  }
  return <PepperSettingsView pepper={result.data.pepper} />
}

export default PepperSettings
