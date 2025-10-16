import { Delete } from '@mui/icons-material'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApiTokenMetaData,
  useCreateApiTokenMutation,
  useDeleteApiTokenMutation,
  useGetApiTokenMetaDataQuery,
} from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { formatDate } from '../../util/formatDate'
import SettingsCard from '../user-settings/SettingsCard'
import PepperSettings from './PepperSettings'

const Container = styled.div`
  background: ghostwhite;
  padding: 20px;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`

const NewTokenText = styled.p`
  padding: 10px;
  border: 1px solid black;
  border-radius: 6px;
  margin-top: 15px;
  word-break: break-all;
`

const DeleteIcon = styled(Delete)`
  display: block !important;
  cursor: pointer;
`

type ApiTokenSettingsProps = {
  showPepperSection: boolean
}
const ApiTokenSettings = ({ showPepperSection }: ApiTokenSettingsProps): ReactElement => {
  const metaDataQuery = useGetApiTokenMetaDataQuery({})

  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('projectSettings')

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
  }, [metaDataQuery, t])

  const [createToken] = useCreateApiTokenMutation({
    onCompleted: result => {
      enqueueSnackbar(t('tokenCreateSuccessMessage'), { variant: 'success' })
      setCreatedToken(result.createApiTokenPayload)
      metaDataQuery.refetch()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  const [deleteToken] = useDeleteApiTokenMutation({
    onCompleted: () => {
      enqueueSnackbar(t('tokenDeleteSuccessMessage'), { variant: 'success' })
      metaDataQuery.refetch()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  return (
    <>
      <ConfirmDialog
        color='error'
        open={tokenToDelete !== null}
        title={t('deleteToken')}
        id='delete-api-token-dialog'
        onConfirm={() => {
          if (tokenToDelete !== null) {
            deleteToken({ variables: { id: tokenToDelete } })
            setTokenToDelete(null)
          }
        }}
        onClose={() => setTokenToDelete(null)}
        confirmButtonIcon={<Delete />}
        confirmButtonText={t('deleteToken')}>
        <Typography component='p' variant='body2'>
          {t('deleteTokenConfirmationPrompt')}
        </Typography>
      </ConfirmDialog>
      <SettingsCard title={t('apiToken')}>
        {showPepperSection && <PepperSettings />}

        <Container>
          <Typography variant='h6'>{t('createNewToken')}</Typography>
          <Typography component='p' variant='body2'>
            {t('tokenOnlyShowedOnceHint')}
          </Typography>
          <Stack direction='row' my={2} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id='expiresIn-label'>{t('validPeriod')}</InputLabel>
              <Select
                size='small'
                labelId='expiresIn-label'
                name='expiresIn'
                id='expiresIn'
                value={expiresIn}
                label={t('validPeriod')}
                onChange={e => setExpiresIn(e.target.value)}>
                <MenuItem value={1}>1 {t('month')}</MenuItem>
                <MenuItem value={3}>3 {t('months')}</MenuItem>
                <MenuItem value={12}>1 {t('year')}</MenuItem>
                <MenuItem value={36}>3 {t('years')}</MenuItem>
              </Select>
            </FormControl>
            <Button sx={{ minWidth: 'auto' }} onClick={() => createToken({ variables: { expiresIn } })}>
              {t('create')}
            </Button>
          </Stack>
          {createdToken !== null && (
            <>
              <Typography component='p' variant='body2'>
                {t('newToken')}:
              </Typography>
              <NewTokenText>
                <Typography variant='body1'>{createdToken}</Typography>
              </NewTokenText>
            </>
          )}
        </Container>

        <Typography variant='body2'>
          {tokenMetaData.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('eMailOfCreator')}</TableCell>
                  <TableCell>{t('expirationDate')}</TableCell>
                  <TableCell aria-label='Delete' />
                </TableRow>
              </TableHead>
              <TableBody>
                {tokenMetaData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.creatorEmail}</TableCell>
                    <TableCell>{formatDate(item.expirationDate)}</TableCell>
                    <TableCell>
                      <DeleteIcon color='error' onClick={() => setTokenToDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Typography>
      </SettingsCard>
    </>
  )
}

export default ApiTokenSettings
