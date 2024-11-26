import { Alert, Button, H2, H4, HTMLSelect, HTMLTable } from '@blueprintjs/core'
import Delete from '@mui/icons-material/Delete'
import React, { ReactElement, useEffect, useState } from 'react'
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
import SettingsCard from '../user-settings/SettingsCard'
import getQueryResult from '../util/getQueryResult'
import PepperSettings from './PepperSettings'

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
  padding: 10px;
  border: 1px solid black;
  border-radius: 6px;
  margin-top: 15px;
  word-break: break-all;
`

const TableData = styled.td`
  vertical-align: middle !important;
`

const DeleteIcon = styled(Delete)`
  display: block !important;
  cursor: pointer;
`

type UserEndpointSettingsProps = {
  showPepperSection: boolean
}
const UserEndpointSettings = ({ showPepperSection }: UserEndpointSettingsProps): ReactElement => {
  const metaDataQuery = useGetApiTokenMetaDataQuery({})

  const appToaster = useAppToaster()

  const [tokenMetaData, setTokenMetadata] = useState<Array<ApiTokenMetaData>>([])
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<number>(1)

  const [tokenToDelete, setTokenToDelete] = useState<number | null>(null)

  useEffect(() => {
    const metaDataQueryResult = getQueryResult(metaDataQuery)
    if (metaDataQueryResult.successful) {
      const { tokenMetaData } = metaDataQueryResult.data
      setTokenMetadata(tokenMetaData)
    }
  }, [metaDataQuery])

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
    onCompleted: () => {
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
    <>
      <Alert
        cancelButtonText='Abbrechen'
        confirmButtonText='Token löschen'
        icon='trash'
        intent='danger'
        isOpen={tokenToDelete !== null}
        onCancel={() => setTokenToDelete(null)}
        onConfirm={() => {
          if (tokenToDelete !== null) {
            deleteToken({ variables: { id: tokenToDelete } })
            setTokenToDelete(null)
          }
        }}>
        <p>Möchten Sie das Token unwiderruflich löschen?</p>
      </Alert>
      <SettingsCard>
        <H2>Api Token</H2>
        {showPepperSection && <PepperSettings />}
        <Container>
          <H4>Neues Token erstellen</H4>
          <p>
            Ein neu erzeugtes Token wir nur einmalig angezeigt und kann danach nicht wieder abgerufen werden. Bitte
            speichern Sie dieses Token an einem sicheren Ort.
          </p>
          <Row>
            <label htmlFor='expiresIn'>Gültigkeitsdauer:</label>
            <HTMLSelect
              name='expiresIn'
              id='expiresIn'
              value={expiresIn}
              onChange={e => setExpiresIn(parseInt(e.target.value, 10))}>
              <option value='1'>1 Monat</option>
              <option value='3'>3 Monate</option>
              <option value='12'>1 Jahr</option>
              <option value='36'>3 Jahre</option>
            </HTMLSelect>
            <Button intent='primary' onClick={() => createToken({ variables: { expiresIn } })}>
              Erstellen
            </Button>
          </Row>
          {createdToken !== null && (
            <>
              <p>Neues Token:</p>
              <NewTokenText> {createdToken}</NewTokenText>
            </>
          )}
        </Container>

        {tokenMetaData.length > 0 && (
          <HTMLTable>
            <thead>
              <tr>
                <th>E-Mail des Erstellers</th>
                <th>Ablaufdatum</th>
                <th aria-label='Delete' />
              </tr>
            </thead>
            <tbody>
              {tokenMetaData.map(item => (
                <tr key={item.id}>
                  <TableData>{item.creatorEmail}</TableData>
                  <TableData>{formatDate(item.expirationDate)}</TableData>
                  <TableData>
                    <DeleteIcon color='error' onClick={() => setTokenToDelete(item.id)} />
                  </TableData>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        )}
      </SettingsCard>
    </>
  )
}

export default UserEndpointSettings
