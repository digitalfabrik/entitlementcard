import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { AnyVariables, TypedDocumentNode, useQuery } from 'urql'

import EmailPreview from '../../../components/EmailPreview'
import getQueryResult from '../../../util/getQueryResult'

type MailTextPreviewProps<Variables extends AnyVariables> = {
  /** Query returning the html of the mail, the type of the variables is inferred from it */
  query: TypedDocumentNode<{ preview: string }, Variables>
  variables: Variables
  text: string
  activated: boolean
  textShownStatus: string
  textHiddenStatus: string
}

/** Loads the html of a mail containing a customizable text and shows it as a preview */
const MailTextPreview = <Variables extends AnyVariables>({
  query,
  variables,
  text,
  activated,
  textShownStatus,
  textHiddenStatus,
}: MailTextPreviewProps<Variables>): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const textShown = activated && text.trim().length > 0
  const [previewState, previewQuery] = useQuery({ query, variables })
  const previewQueryResult = getQueryResult(previewState, previewQuery)

  if (!previewQueryResult.successful) {
    return previewQueryResult.component
  }

  return (
    <EmailPreview
      html={previewQueryResult.data.preview}
      hint={t('mailPreviewHint')}
      status={textShown ? textShownStatus : textHiddenStatus}
      statusActive={textShown}
    />
  )
}

export default MailTextPreview
