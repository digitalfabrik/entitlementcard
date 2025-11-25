import { Close, Done, DownloadForOffline } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import EmailLink from '../components/EmailLink'
import { AuthContext } from '../provider/AuthProvider'
import downloadDataUri from '../util/downloadDataUri'
import { isEmailValid } from '../util/verifications'
import type { GeneralJsonField, JsonField, JsonFieldViewProps } from './JsonFieldView'

const extensionByContentType = new Map([
  ['application/pdf', 'pdf'],
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
])

// Some field names are equal therefore the parents are needed for resolving the label
const getTranslationKey = (fieldName: string, parentName?: string) =>
  parentName ? `${parentName}.${fieldName}` : fieldName

const JsonFieldAttachment = memo(
  ({ jsonField, baseUrl, attachmentAccessible, parentName }: JsonFieldViewProps<JsonField<'Attachment'>>) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const token = useContext(AuthContext).data?.token
    const { t } = useTranslation('application')
    const attachment = jsonField.value

    if (attachmentAccessible) {
      const downloadUrl = `${baseUrl}/file/${attachment.fileIndex}`
      const onClick = async () => {
        const loadingSnackbarKey = enqueueSnackbar(
          `${t('applicationsOverview:loadAttachment')} ${attachment.fileIndex + 1}...`,
          { variant: 'info', persist: true, action: () => null }
        )
        try {
          const result = await fetch(downloadUrl, { headers: { authorization: `Bearer ${token}` } })
          const contentType = result.headers.get('content-type')
          if (result.status !== 200) {
            throw Error('Status Code is not OK')
          } else if (contentType === null || !extensionByContentType.has(contentType)) {
            throw Error('Invalid Content Type')
          }
          const filename = `${t('applicationsOverview:attachment')}${
            attachment.fileIndex + 1
          }.${extensionByContentType.get(contentType)}`
          const arrayBuffer = await result.arrayBuffer()
          const file = new File([arrayBuffer], filename, { type: contentType })
          downloadDataUri(file, filename)
        } catch (e) {
          console.error(e)
          enqueueSnackbar(t('errors:unknown'), { variant: 'error' })
        } finally {
          closeSnackbar(loadingSnackbarKey)
        }
      }
      return (
        <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
          <Typography> {t(getTranslationKey(jsonField.name, parentName))}:</Typography>
          <Button
            size='small'
            endIcon={<DownloadForOffline />}
            onClick={onClick}
            sx={{ py: 0, displayPrint: 'none', boxShadow: 0 }}>{`${t('applicationsOverview:attachment')} ${
            jsonField.value.fileIndex + 1
          }`}</Button>
          <Typography sx={{ display: 'none', displayPrint: 'block' }}>
            {`(${t('applicationsOverview:seeAttachment')} ${jsonField.value.fileIndex + 1})`}
          </Typography>
        </Stack>
      )
    }
    return (
      <Typography component='p'>
        {t(getTranslationKey(jsonField.name, parentName))}:&nbsp;
        <Typography component='span'>{t('applicationsOverview:submittedButNotVisible')}</Typography>
      </Typography>
    )
  }
)

const JsonFieldElemental = ({
  jsonField,
  parentName,
  ...rest
}: JsonFieldViewProps<Exclude<GeneralJsonField, JsonField<'Array'>>>) => {
  const { t } = useTranslation('application')

  switch (jsonField.type) {
    case 'String':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}:{' '}
          {isEmailValid(jsonField.value) ? (
            <EmailLink email={jsonField.value} />
          ) : (
            <Typography component='span'>{jsonField.value}</Typography>
          )}
        </Typography>
      )
    case 'TranslatableString':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}:{' '}
          <Typography component='span'>{t(getTranslationKey(jsonField.value, parentName))}</Typography>
        </Typography>
      )
    case 'Date':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}:{' '}
          {new Date(jsonField.value).toLocaleDateString('de', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </Typography>
      )
    case 'Number':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}: {jsonField.value}
        </Typography>
      )
    case 'Boolean':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}:&nbsp;
          {jsonField.value ? (
            <>
              <Done color='success' sx={{ fontSize: 16, verticalAlign: 'sub' }} />
              {t('positiveAnswer')}
            </>
          ) : (
            <>
              <Close color='error' sx={{ fontSize: 16, verticalAlign: 'sub' }} />
              {t('negativeAnswer')}
            </>
          )}
        </Typography>
      )
    case 'Attachment':
      return <JsonFieldAttachment jsonField={jsonField} parentName={parentName} {...rest} />
  }
}

export default memo(JsonFieldElemental)
