import { Button, Checkbox, H2 } from '@blueprintjs/core'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetActivatedForApplicationQuery, useUpdateActivatedForApplicationMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import SettingsCard from '../user-settings/SettingsCard'
import getQueryResult from '../util/getQueryResult'

const ButtonContainer = styled.div`
  text-align: right;
  padding: 10px 0;
`

const ActivatedForApplicationCard = ({ regionId }: { regionId: number }): ReactElement => {
  const [activatedForApplication, setActivatedForApplication] = useState<boolean>(false)
  const appToaster = useAppToaster()
  const activatedForApplicationQuery = useGetActivatedForApplicationQuery({
    variables: { regionId: regionId },
  })

  const [updateActivatedForApplication, { loading }] = useUpdateActivatedForApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Einstellungen wurden erfolgreich geändert.' })
    },
  })
  useEffect(() => {
    const activatedForApplicationQueryResult = getQueryResult(activatedForApplicationQuery)
    if (activatedForApplicationQueryResult.successful) {
      const { activatedForApplication } = activatedForApplicationQueryResult.data.result
      setActivatedForApplication(activatedForApplication)
    }
  }, [activatedForApplicationQuery])

  const activatedForApplicationQueryResult = getQueryResult(activatedForApplicationQuery)
  if (!activatedForApplicationQueryResult.successful) return activatedForApplicationQueryResult.component

  return (
    <SettingsCard>
      <H2>Aktivierung Beantragungsprozess</H2>
      <p>Hier können Sie festlegen, ob Ihre Region für den neuen Antragsprozess freigeschaltet ist.</p>
      <Checkbox
        checked={activatedForApplication}
        onChange={e => setActivatedForApplication(e.currentTarget.checked)}
        label='Region ist aktiviert'
      />
      <ButtonContainer>
        <Button
          text={'Speichern'}
          intent={'primary'}
          onClick={() =>
            updateActivatedForApplication({
              variables: {
                regionId,
                activated: activatedForApplication,
              },
            })
          }
          loading={loading}
        />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default ActivatedForApplicationCard
