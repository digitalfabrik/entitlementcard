import { useSnackbar } from 'notistack'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import { messageFromGraphQlError } from '../../../errors'
import {
  GetApplicationConfirmationMailPreviewDocument,
  GetApplicationConfirmationNoteInformationDocument,
  GraphQlExceptionCode,
  UpdateApplicationConfirmationNoteDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import MailTextPreview from '../mail-text-setting/MailTextPreview'
import MailTextSettingCard from '../mail-text-setting/MailTextSettingCard'

// Must match APPLICATION_CONFIRMATION_MAIL_NOTE_MAX_CHARS in backend/src/main/kotlin/app/ehrenamtskarte/backend/db/entities/Region.kt
const MAX_NOTE_CHARS = 1000

type ApplicationConfirmationNoteControllerProps = {
  regionId: number
}

const ApplicationConfirmationNoteController = ({
  regionId,
}: ApplicationConfirmationNoteControllerProps): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [applicationConfirmationNoteState, applicationConfirmationNoteQuery] = useQuery({
    query: GetApplicationConfirmationNoteInformationDocument,
    variables: { regionId },
  })

  const [updateApplicationNoteState, updateApplicationNoteMutation] = useMutation(
    UpdateApplicationConfirmationNoteDocument,
  )
  const applicationConfirmationNoteQueryResult = getQueryResult(
    applicationConfirmationNoteState,
    applicationConfirmationNoteQuery,
  )

  if (!applicationConfirmationNoteQueryResult.successful) {
    return applicationConfirmationNoteQueryResult.component
  }

  const { applicationConfirmationMailNote, applicationConfirmationMailNoteActivated } =
    applicationConfirmationNoteQueryResult.data.region

  const saveApplicationConfirmationNote = async (note: string, activated: boolean) => {
    const result = await updateApplicationNoteMutation({
      regionId,
      note,
      activated,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('applicationConfirmationMailNoteSavedSuccessful'), { variant: 'success' })
      applicationConfirmationNoteQuery({ requestPolicy: 'network-only' })
    }
  }

  return (
    <MailTextSettingCard
      texts={{
        headline: t('applicationConfirmationMailNoteHeadline'),
        explanation: t('applicationConfirmationMailNoteExplanation'),
        dialogTitle: t('applicationConfirmationMailNoteDialogTitle'),
        placeholder: t('applicationConfirmationMailNoteDialogPlaceholder'),
        activatedLabel: t('applicationConfirmationMailNoteActivated'),
      }}
      maxChars={MAX_NOTE_CHARS}
      maxCharsErrorCode={GraphQlExceptionCode.InvalidApplicationConfirmationNoteSize}
      defaultText={applicationConfirmationMailNote}
      defaultActivated={applicationConfirmationMailNoteActivated}
      isSaving={updateApplicationNoteState.fetching}
      onSave={saveApplicationConfirmationNote}
      renderPreview={(text, activated) => (
        <MailTextPreview
          query={GetApplicationConfirmationMailPreviewDocument}
          variables={{
            regionId,
            applicationConfirmationNote: text,
            applicationConfirmationNoteActivated: activated,
          }}
          text={text}
          activated={activated}
          textShownStatus={t('applicationConfirmationMailPreviewNoteShown')}
          textHiddenStatus={t('applicationConfirmationMailPreviewNoteHidden')}
        />
      )}
    />
  )
}

export default ApplicationConfirmationNoteController
