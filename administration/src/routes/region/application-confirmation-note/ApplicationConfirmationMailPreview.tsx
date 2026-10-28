import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import EmailPreview from '../../../components/EmailPreview'
import { GetApplicationConfirmationMailPreviewDocument } from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'

type ApplicationConfirmationMailPreviewProps = {
  regionId: number
  note: string
  noteActivated: boolean
}

const ApplicationConfirmationMailPreview = ({
  regionId,
  note,
  noteActivated,
}: ApplicationConfirmationMailPreviewProps): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const showNote = noteActivated && note.trim().length > 0
  const [previewState, previewQuery] = useQuery({
    query: GetApplicationConfirmationMailPreviewDocument,
    variables: {
      regionId,
      applicationConfirmationNote: note,
      applicationConfirmationNoteActivated: noteActivated,
    },
  })
  const previewQueryResult = getQueryResult(previewState, previewQuery)

  if (!previewQueryResult.successful) {
    return previewQueryResult.component
  }

  return (
    <EmailPreview
      html={previewQueryResult.data.preview}
      hint={t('applicationConfirmationMailPreviewHint')}
      status={
        showNote
          ? t('applicationConfirmationMailPreviewNoteShown')
          : t('applicationConfirmationMailPreviewNoteHidden')
      }
      statusActive={showNote}
    />
  )
}

export default ApplicationConfirmationMailPreview
