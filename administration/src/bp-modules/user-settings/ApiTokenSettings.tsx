import { Button, H2, H4, HTMLSelect, HTMLTable } from '@blueprintjs/core'
import Delete from '@mui/icons-material/Delete'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApiTokenMetaData,
  useCreateApiTokenMutation,
  useDeleteApiTokenMutation,
  useGetApiTokenMetaDataQuery,
} from '../../generated/graphql'
import { formatDate } from '../../util/formatDate'
import { useAppToaster } from '../AppToaster'
import getQueryResult from '../util/getQueryResult'
import SettingsCard from './SettingsCard'

const Container = styled.div`
  background: ghostwhite;
  padding: 20px;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`

const Row = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`

const NewTokenText = styled.p`
  font-size: 18px;
  color: #007bff;
  background: #e9f7ff;
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
  word-break: break-all;
`

const ApiTokenSetting = () => {
  const metaDataQuery = useGetApiTokenMetaDataQuery({})

  const appToaster = useAppToaster()

  const [tokenMetaData, setTokenMetadata] = useState<Array<ApiTokenMetaData>>([])
  const [createdToken, setCreatedToken] = useState<string>('')
  const [expiresIn, setExpiresIn] = useState<number>(1)

  useEffect(() => {
    const metaDataQueryResult = getQueryResult(metaDataQuery)
    if (metaDataQueryResult.successful) {
      const { tokenMetaData } = metaDataQueryResult.data
      setTokenMetadata(tokenMetaData)
    }
  }, [metaDataQuery, tokenMetaData])

  const [createToken] = useCreateApiTokenMutation({
    onCompleted: result => {
      appToaster?.show({ intent: 'success', message: 'Token wurde erfolgreich erzeugt.' })
      setCreatedToken(result.createApiTokenPayload)
      metaDataQuery.refetch()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
      })
    },
  })

  const [deleteToken] = useDeleteApiTokenMutation({
    onCompleted: result => {
      appToaster?.show({ intent: 'success', message: 'Token wurde erfolgreich gelöscht.' })
      metaDataQuery.refetch()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
      })
    },
  })

  return (
    <SettingsCard>
      <H2>Api Token</H2>

      <Container>
        <H4>Neues Token erstellen</H4>
        <p>Ein neu erzeugtes Token wir nur einmalig angezeigt und kann danach nicht wieder abgerufen werden.</p>
        <Row>
          <label htmlFor='expiresIn'>Gültigkeitsdauer:</label>
          <HTMLSelect
            name='expiresIn'
            id='expiresIn'
            value={expiresIn}
            onChange={e => setExpiresIn(parseInt(e.target.value))}>
            <option value='1'>1 Monat</option>
            <option value='3'>3 Monate</option>
            <option value='12'>1 Jahr</option>
            <option value='36'>3 Jahre</option>
          </HTMLSelect>

          <Button intent='primary' onClick={() => createToken({ variables: { expiresIn: expiresIn } })}>
            Erstellen
          </Button>
        </Row>
        {createdToken && <NewTokenText>New Token: {createdToken}</NewTokenText>}
      </Container>

      {tokenMetaData.length > 0 && (
        <HTMLTable>
          <thead>
            <tr>
              <th>E-Mail des Erstellers</th>
              <th>Ablaufdatum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tokenMetaData.map((item, index) => (
              <tr key={index}>
                <td>{item.creatorEmail}</td>
                <td>{formatDate(item.expirationDate)}</td>
                <td>
                  <Delete color='error' onClick={() => deleteToken({ variables: { id: item.id } })} />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </SettingsCard>
  )
}

export default ApiTokenSetting
