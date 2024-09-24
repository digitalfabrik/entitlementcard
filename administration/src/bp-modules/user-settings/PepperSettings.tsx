import { Callout } from '@blueprintjs/core'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useGetPepperQuery } from '../../generated/graphql'
import PasswordInput from '../PasswordInput'
import getQueryResult from '../util/getQueryResult'

const Container = styled.div`
  padding: 10px 0;
`

const PepperSettings = () => {
  const pepperQuery = useGetPepperQuery()
  const [pepper, setPepper] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (pepperQuery.data) {
      setError(false)
      setPepper(pepperQuery.data.pepper)
    } else if (pepperQuery.error) {
      setError(true)
    }
  }, [pepperQuery])

  return (
    <Container>
      <p>Um den Endpunkt zu nutzen, müssen die Nutzerdaten mit folgenden Pepper gehashet werden:</p>
      {error ? (
        <Callout intent='danger'>
          Es ist kein Koblenz Pepper hinterlegt. Das Feature ist in dieser Umgebung aktuell nicht verfügbar!
        </Callout>
      ) : (
        <PasswordInput label='' value={pepper} setValue={() => {}} />
      )}
    </Container>
  )
}

export default PepperSettings
