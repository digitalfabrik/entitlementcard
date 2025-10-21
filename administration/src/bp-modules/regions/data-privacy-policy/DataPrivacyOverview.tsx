import { ArrowBack, SaveAlt } from '@mui/icons-material'
import { Button, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import graphQlErrorMap from '../../../errors/GraphQlErrorMap'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { GraphQlExceptionCode, useUpdateDataPolicyMutation } from '../../../generated/graphql'
import ButtonBar from '../../ButtonBar'

type RegionOverviewProps = {
  dataPrivacyPolicy: string
  regionId: number
}

const MAX_CHARS = 20000

const DataPrivacyOverview = ({ dataPrivacyPolicy, regionId }: RegionOverviewProps): ReactElement => {
  const { palette } = useTheme()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [dataPrivacyText, setDataPrivacyText] = useState<string>(dataPrivacyPolicy)
  const [updateDataPrivacy, { loading }] = useUpdateDataPolicyMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('dataPrivacyChangeSuccessful'), { variant: 'success' })
    },
  })
  const maxCharsExceeded = dataPrivacyText.length > MAX_CHARS

  const onSave = () => updateDataPrivacy({ variables: { regionId, text: dataPrivacyText } })

  const { title: errorMessage } = graphQlErrorMap({
    code: GraphQlExceptionCode.InvalidDataPolicySize,
    maxSize: MAX_CHARS,
  })

  return (
    <>
      <Stack
        px={12}
        justifyContent='space-evenly'
        alignItems='center'
        flexGrow={1}
        sx={{
          zIndex: 0,
        }}>
        <Typography variant='h5' textAlign='center' margin={2}>
          {t('dataPrivacy')}
        </Typography>
        <TextField
          rows={30}
          fullWidth
          placeholder={t('dataPrivacyPlaceholder')}
          multiline
          value={dataPrivacyText}
          onChange={e => setDataPrivacyText(e.target.value)}
        />
        <Typography
          m={2}
          sx={{
            alignSelf: 'flex-start',
            color: maxCharsExceeded ? palette.error.main : palette.text.primary,
          }}>
          {dataPrivacyText.length}/{MAX_CHARS}
        </Typography>
      </Stack>
      <ButtonBar>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
        <Tooltip title={maxCharsExceeded ? errorMessage : undefined} placement='top' arrow>
          <span>
            <Button
              disabled={maxCharsExceeded}
              startIcon={<SaveAlt />}
              color='primary'
              onClick={onSave}
              loading={loading}>
              {t('save')}
            </Button>
          </span>
        </Tooltip>
      </ButtonBar>
    </>
  )
}
export default DataPrivacyOverview
