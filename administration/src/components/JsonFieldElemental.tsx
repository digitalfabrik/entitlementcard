import { Close, Done, DownloadForOffline } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useSnackbar } from 'notistack'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Intl, Temporal } from 'temporal-polyfill'

import EmailLink from '../components/EmailLink'
import { AuthContext } from '../provider/AuthProvider'
import { defaultUiLocale } from '../translations/i18n'
import downloadDataUri from '../util/downloadDataUri'
import { isEmailValid } from '../util/verifications'
import type { GeneralJsonField, JsonField, JsonFieldViewProps } from './JsonFieldView'

const extensionByContentType: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
} as const

// Some field names are equal, therefore, the parents are needed for resolving the label
const getTranslationKey = (fieldName: string, parentName?: string) =>
  parentName ? `${parentName}.${fieldName}` : fieldName

const JsonFieldAttachment = memo(
  ({
    jsonField,
    baseUrl,
    attachmentAccessible,
    parentName,
  }: JsonFieldViewProps<JsonField<'Attachment'>>) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const token = useContext(AuthContext).data?.token
    const { t } = useTranslation('application')
    const attachment = jsonField.value

    if (attachmentAccessible) {
      const onClick = async () => {
        const loadingSnackbarKey = enqueueSnackbar(
          t('applicationsOverview:loadAttachment', { index: attachment.fileIndex + 1 }),
          { variant: 'info', persist: true, action: () => null },
        )
        const result = await fetch(`${baseUrl}/file/${attachment.fileIndex}`, {
          headers: { authorization: `Bearer ${token}` },
        })
        const contentType = result.headers.get('content-type')

        if (
          result.status !== 200 ||
          contentType === null ||
          !(contentType in extensionByContentType)
        ) {
          enqueueSnackbar(t('errors:unknown'), { variant: 'error' })
        } else {
          const filename = t('applicationsOverview:attachmentFilename', {
            index: attachment.fileIndex + 1,
            fileExtension: extensionByContentType[contentType],
          })

          downloadDataUri(
            new File([await result.arrayBuffer()], filename, { type: contentType }),
            filename,
          )
        }
        closeSnackbar(loadingSnackbarKey)
      }

      return (
        <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
          <Typography> {t(getTranslationKey(jsonField.name, parentName))}:</Typography>
          <Button
            size='small'
            endIcon={<DownloadForOffline />}
            onClick={onClick}
            sx={{ py: 0, displayPrint: 'none', boxShadow: 0 }}
          >{`${t('applicationsOverview:attachment')} ${jsonField.value.fileIndex + 1}`}</Button>
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
  },
)

const JsonFieldElemental = ({
  jsonField,
  parentName,
  ...rest
}: JsonFieldViewProps<Exclude<GeneralJsonField, JsonField<'Array'>>>) => {
  const { t } = useTranslation('application')
  const dateFormatter = Intl.DateTimeFormat(defaultUiLocale, { dateStyle: 'medium' })

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
          <Typography component='span'>
            {t(getTranslationKey(jsonField.value, parentName))}
          </Typography>
        </Typography>
      )
    case 'Date':
      return (
        <Typography component='p'>
          {t(getTranslationKey(jsonField.name, parentName))}:{' '}
          {dateFormatter.format(Temporal.PlainDateTime.from(jsonField.value))}
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
