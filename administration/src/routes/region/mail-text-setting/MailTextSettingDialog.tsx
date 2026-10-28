import { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BaseCheckbox from '../../../components/BaseCheckbox'
import TextAreaDialog from '../../../components/TextAreaDialog'
import { GraphQlExceptionCode } from '../../../graphql'

export type MailTextSettingTexts = {
  headline: string
  explanation: string
  dialogTitle: string
  dialogDescription?: string
  placeholder: string
  activatedLabel: string
}

export type MailTextSettingProps = {
  texts: MailTextSettingTexts
  maxChars: number
  maxCharsErrorCode: GraphQlExceptionCode
  defaultText: string | null | undefined
  defaultActivated: boolean
  isSaving: boolean
  onSave: (text: string, activated: boolean) => void
  renderPreview: (text: string, activated: boolean) => ReactNode
}

type MailTextSettingDialogProps = MailTextSettingProps & {
  onClose: () => void
}

/** Dialog to edit and preview a customizable text of a mail, which can be activated and deactivated */
const MailTextSettingDialog = ({
  texts,
  maxChars,
  maxCharsErrorCode,
  defaultText,
  defaultActivated,
  isSaving,
  onSave,
  renderPreview,
  onClose,
}: MailTextSettingDialogProps): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const [activated, setActivated] = useState(defaultActivated)

  return (
    <TextAreaDialog
      title={texts.dialogTitle}
      description={texts.dialogDescription}
      defaultText={defaultText}
      maxChars={maxChars}
      maxCharsErrorCode={maxCharsErrorCode}
      placeholder={texts.placeholder}
      isOpen
      onSave={text => onSave(text, activated)}
      onClose={onClose}
      loading={isSaving}
      additionalContent={
        <BaseCheckbox
          checked={activated}
          onChange={setActivated}
          label={texts.activatedLabel}
          hasError={false}
          errorMessage={undefined}
        />
      }
      preview={{ label: t('mailPreview'), render: text => renderPreview(text, activated) }}
    />
  )
}

export default MailTextSettingDialog
