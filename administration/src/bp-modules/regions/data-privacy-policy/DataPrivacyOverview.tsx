import { TextArea, Tooltip } from '@blueprintjs/core'
import { ArrowBack, SaveAlt } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import graphQlErrorMap from '../../../errors/GraphQlErrorMap'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { GraphQlExceptionCode, useUpdateDataPolicyMutation } from '../../../generated/graphql'
import ButtonBar from '../../ButtonBar'

const Content = styled.div`
  padding: 0 6rem;
  width: 100%;
  z-index: 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`

const CharCounter = styled.span<{ $hasError: boolean }>`
  text-align: center;
  align-self: flex-start;
  color: ${props => (props.$hasError ? 'red' : 'black')};
  margin: 15px;
`

type RegionOverviewProps = {
  dataPrivacyPolicy: string
  regionId: number
}

const MAX_CHARS = 20000

const DataPrivacyOverview = ({ dataPrivacyPolicy, regionId }: RegionOverviewProps): ReactElement => {
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
      <Content>
        <Typography variant='h5' textAlign='center' margin={2}>
          {t('dataPrivacy')}
        </Typography>
        <TextArea
          fill
          onChange={e => setDataPrivacyText(e.target.value)}
          value={dataPrivacyText}
          large
          rows={20}
          placeholder={t('dataPrivacyPlaceholder')}
        />
        <CharCounter $hasError={maxCharsExceeded}>
          {dataPrivacyText.length}/{MAX_CHARS}
        </CharCounter>
      </Content>
      <ButtonBar>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
        <Tooltip content={maxCharsExceeded ? errorMessage : undefined}>
          <Button
            disabled={maxCharsExceeded}
            startIcon={<SaveAlt />}
            color='primary'
            onClick={onSave}
            loading={loading}>
            {t('save')}
          </Button>
        </Tooltip>
      </ButtonBar>
    </>
  )
}
export default DataPrivacyOverview
