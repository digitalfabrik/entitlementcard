import { Colors, Icon, Tag } from '@blueprintjs/core'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { AuthContext } from '../../AuthProvider'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import EmailLink from '../EmailLink'
import { printAwareCss } from './ApplicationCard'
import { GeneralJsonField, JsonField, JsonFieldViewProps } from './JsonFieldView'
import { isEmailValid } from './utils/verificationHelper'

const extensionByContentType = new Map([
  ['application/pdf', 'pdf'],
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
])

const PrintAwareTag = styled(Tag)`
  ${printAwareCss};
`

const PrintOnlySpan = styled.span`
  visibility: hidden;
  @media print {
    visibility: visible;
  }
`

const JsonFieldAttachment = memo(
  ({ jsonField, baseUrl, attachmentAccessible }: JsonFieldViewProps<JsonField<'Attachment'>>) => {
    const appToaster = useAppToaster()
    const token = useContext(AuthContext).data?.token
    const { t } = useTranslation('application')

    const attachment = jsonField.value
    if (attachmentAccessible) {
      const downloadUrl = `${baseUrl}/file/${attachment.fileIndex}`
      const onClick = async () => {
        const loadingToastKey = appToaster?.show({
          message: `Lade Anhang ${attachment.fileIndex + 1}...`,
          intent: 'primary',
          isCloseButtonShown: false,
        })
        try {
          const result = await fetch(downloadUrl, { headers: { authorization: `Bearer ${token}` } })
          const contentType = result.headers.get('content-type')
          if (result.status !== 200) {
            throw Error('Status Code is not OK')
          } else if (contentType === null || !extensionByContentType.has(contentType)) {
            throw Error('Invalid Content Type')
          }
          const filename = `anhang${attachment.fileIndex + 1}.${extensionByContentType.get(contentType)}`
          const arrayBuffer = await result.arrayBuffer()
          const file = new File([arrayBuffer], filename, { type: contentType })
          downloadDataUri(file, filename)
        } catch (e) {
          console.error(e)
          appToaster?.show({ message: 'Etwas ist schiefgelaufen.', intent: 'danger' })
        } finally {
          if (loadingToastKey !== undefined) {
            appToaster?.dismiss(loadingToastKey)
          }
        }
      }
      return (
        <p>
          {t(jsonField.name)}:&nbsp;
          <PrintAwareTag
            round
            rightIcon={<Icon icon='download' color={Colors.GRAY1} />}
            interactive
            minimal
            onClick={onClick}>{`Anhang ${jsonField.value.fileIndex + 1}`}</PrintAwareTag>
          <PrintOnlySpan>{`(siehe Anhang ${jsonField.value.fileIndex + 1})`}</PrintOnlySpan>
        </p>
      )
    }
    return (
      <p>
        {t(jsonField.name)}:&nbsp;
        <span>eingereicht, nicht sichtbar</span>
      </p>
    )
  }
)

const JsonFieldElemental = ({
  jsonField,
  parentName,
  ...rest
}: JsonFieldViewProps<Exclude<GeneralJsonField, JsonField<'Array'>>>) => {
  const { t } = useTranslation('application')
  const getTranslationKey = () => (parentName ? `${parentName}.${jsonField.name}` : jsonField.name)

  switch (jsonField.type) {
    case 'String':
      return (
        <p>
          {t(getTranslationKey())}:{' '}
          {isEmailValid(jsonField.value) ? <EmailLink email={jsonField.value} /> : <span>{jsonField.value}</span>}
        </p>
      )
    case 'Date':
      return (
        <p>
          {t(getTranslationKey())}: {new Date(jsonField.value).toLocaleDateString('de')}
        </p>
      )
    case 'Number':
      return (
        <p>
          {t(getTranslationKey())}: {jsonField.value}
        </p>
      )
    case 'Boolean':
      return (
        <p>
          {t(getTranslationKey())}:&nbsp;
          {jsonField.value ? (
            <>
              <Icon icon='tick' intent='success' /> Ja
            </>
          ) : (
            <>
              <Icon icon='cross' intent='danger' /> Nein
            </>
          )}
        </p>
      )
    case 'Attachment':
      return <JsonFieldAttachment jsonField={jsonField} {...rest} />
  }
}

export default memo(JsonFieldElemental)
