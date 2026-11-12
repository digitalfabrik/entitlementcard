import { Typography } from '@mui/material'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SettingsCard from '../../../components/SettingsCard'
import MailTextSettingDialog, { MailTextSettingProps } from './MailTextSettingDialog'

/** Settings card for a customizable text of a mail, e.g. a note or contact information */
const MailTextSettingCard = ({ texts, ...dialogProps }: MailTextSettingProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('regionSettings')

  return (
    <>
      <SettingsCard
        title={texts.headline}
        action={{ label: t('open'), onSubmit: () => setIsOpen(true) }}
      >
        <Typography component='p'>{texts.explanation}</Typography>
      </SettingsCard>
      {isOpen && (
        <MailTextSettingDialog {...dialogProps} texts={texts} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

export default MailTextSettingCard
