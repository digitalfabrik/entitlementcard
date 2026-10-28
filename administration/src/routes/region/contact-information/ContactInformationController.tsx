import { useSnackbar } from 'notistack'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import { messageFromGraphQlError } from '../../../errors'
import {
  GetContactInformationDocument,
  GetContactInformationMailPreviewDocument,
  GraphQlExceptionCode,
  UpdateContactInformationDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import MailTextPreview from '../mail-text-setting/MailTextPreview'
import MailTextSettingCard from '../mail-text-setting/MailTextSettingCard'

// Must match CONTACT_INFORMATION_MAX_CHARS in backend/src/main/kotlin/app/ehrenamtskarte/backend/db/entities/Region.kt
const MAX_CONTACT_INFORMATION_CHARS = 500

type ContactInformationControllerProps = {
  regionId: number
}

const ContactInformationController = ({
  regionId,
}: ContactInformationControllerProps): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [contactInformationState, contactInformationQuery] = useQuery({
    query: GetContactInformationDocument,
    variables: { regionId },
  })
  const [updateContactInformationState, updateContactInformationMutation] = useMutation(
    UpdateContactInformationDocument,
  )
  const contactInformationQueryResult = getQueryResult(
    contactInformationState,
    contactInformationQuery,
  )

  if (!contactInformationQueryResult.successful) {
    return contactInformationQueryResult.component
  }

  const { contactInformation, contactInformationActivated } =
    contactInformationQueryResult.data.region

  const saveContactInformation = async (text: string, activated: boolean) => {
    const result = await updateContactInformationMutation({
      regionId,
      contactInformation: text,
      contactInformationActivated: activated,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('contactInformationSavedSuccessful'), { variant: 'success' })
      contactInformationQuery({ requestPolicy: 'network-only' })
    }
  }

  return (
    <MailTextSettingCard
      texts={{
        headline: t('contactInformationHeadline'),
        explanation: t('contactInformationExplanation'),
        dialogTitle: t('contactInformationHeadline'),
        dialogDescription: t('contactInformationDialogDescription'),
        placeholder: t('contactInformationDialogPlaceholder'),
        activatedLabel: t('contactInformationActivated'),
      }}
      maxChars={MAX_CONTACT_INFORMATION_CHARS}
      maxCharsErrorCode={GraphQlExceptionCode.InvalidContactInformationSize}
      defaultText={contactInformation}
      defaultActivated={contactInformationActivated}
      isSaving={updateContactInformationState.fetching}
      onSave={saveContactInformation}
      renderPreview={(text, activated) => (
        <MailTextPreview
          query={GetContactInformationMailPreviewDocument}
          variables={{
            regionId,
            contactInformation: text,
            contactInformationActivated: activated,
          }}
          text={text}
          activated={activated}
          textShownStatus={t('contactInformationMailPreviewShown')}
          textHiddenStatus={t('contactInformationMailPreviewHidden')}
        />
      )}
    />
  )
}

export default ContactInformationController
