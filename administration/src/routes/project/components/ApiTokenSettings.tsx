import { Delete } from '@mui/icons-material'
import {
  Box,
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
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'
import { useMutation, useQuery } from 'urql'

import ConfirmDialog from '../../../components/ConfirmDialog'
import SettingsCard from '../../../components/SettingsCard'
import { messageFromGraphQlError } from '../../../errors'
import {
  ApiTokenMetaData,
  CreateApiTokenDocument,
  DeleteApiTokenDocument,
  GetApiTokenMetaDataDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import PepperSettings from './PepperSettings'

const ApiTokenGeneration = (): ReactElement => {
  const [_, apiTokenQuery] = useQuery({ query: GetApiTokenMetaDataDocument })

  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('projectSettings')

  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<number>(1)

  const [, createApiTokenMutation] = useMutation(CreateApiTokenDocument)

  const createToken = async () => {
    const result = await createApiTokenMutation({ expiresIn })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else if (result.data) {
      enqueueSnackbar(t('tokenCreateSuccessMessage'), { variant: 'success' })
      setCreatedToken(result.data.createApiTokenPayload)
      apiTokenQuery({ requestPolicy: 'network-only' })
    }
  }

  return (
    <Stack
      my={1}
      p={2}
      borderRadius={2}
      boxShadow='inset 0 2px 4px rgba(0, 0, 0, 0.05)'
      bgcolor='ghostwhite'
    >
      <Typography variant='h6'>{t('createNewToken')}</Typography>
      <Typography component='p'>{t('tokenOnlyShowedOnceHint')}</Typography>
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
            onChange={e => setExpiresIn(e.target.value)}
          >
            <MenuItem value={1}>1 {t('month')}</MenuItem>
            <MenuItem value={3}>3 {t('months')}</MenuItem>
            <MenuItem value={12}>1 {t('year')}</MenuItem>
            <MenuItem value={36}>3 {t('years')}</MenuItem>
          </Select>
        </FormControl>
        <Button color='primary' sx={{ minWidth: 'auto' }} variant='contained' onClick={createToken}>
          {t('create')}
        </Button>
      </Stack>
      {createdToken !== null && (
        <>
          <Typography component='p'>{t('newToken')}:</Typography>
          <Box p={2} mt={1} border={1} borderRadius={2} sx={{ wordBreak: 'break-all' }}>
            <Typography variant='body1' sx={{ userSelect: 'all' }}>
              {createdToken}
            </Typography>
          </Box>
        </>
      )}
    </Stack>
  )
}

type ApiTokenSettingsProps = {
  showPepperSection: boolean
}
const ApiTokenSettings = ({ showPepperSection }: ApiTokenSettingsProps): ReactElement => {
  const { t } = useTranslation('projectSettings')
  const [metaDataState, metaDataQuery] = useQuery({ query: GetApiTokenMetaDataDocument })
  const { enqueueSnackbar } = useSnackbar()
  const [tokenToDelete, setTokenToDelete] = useState<number | null>(null)

  const [, deleteApiTokenMutation] = useMutation(DeleteApiTokenDocument)

  const deleteToken = async (id: number) => {
    const result = await deleteApiTokenMutation({ id })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('tokenDeleteSuccessMessage'), { variant: 'success' })
      metaDataQuery({ requestPolicy: 'network-only' })
    }
  }

  const metaDataQueryResult = getQueryResult(metaDataState, metaDataQuery)
  if (!metaDataQueryResult.successful) {
    return metaDataQueryResult.component
  }
  const tokenMetaData: readonly ApiTokenMetaData[] = metaDataQueryResult.data.tokenMetaData

  return (
    <>
      <ConfirmDialog
        confirmButtonColor='error'
        open={tokenToDelete !== null}
        title={t('deleteToken')}
        maxWidth='xs'
        onConfirm={() => {
          if (tokenToDelete !== null) {
            deleteToken(tokenToDelete)
            setTokenToDelete(null)
          }
        }}
        onClose={() => setTokenToDelete(null)}
        confirmButtonIcon={<Delete />}
        confirmButtonText={t('deleteToken')}
      >
        <Typography component='p'>{t('deleteTokenConfirmationPrompt')}</Typography>
      </ConfirmDialog>
      <SettingsCard title={t('apiToken')}>
        {showPepperSection && <PepperSettings />}

        <ApiTokenGeneration />
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
                  <TableCell>
                    {t('expiresIn', { date: Temporal.PlainDate.from(item.expirationDate) })}
                  </TableCell>
                  <TableCell>
                    <Delete
                      sx={{ cursor: 'pointer', display: 'block' }}
                      color='error'
                      onClick={() => setTokenToDelete(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SettingsCard>
    </>
  )
}

export default ApiTokenSettings
