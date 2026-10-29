import { Button, Typography } from '@mui/material'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'
import MailTextSettingDialog, { MailTextSettingProps } from './MailTextSettingDialog'

/** Settings card for a customizable text of a mail, e.g. a note or contact information */
const MailTextSettingCard = ({ texts, ...dialogProps }: MailTextSettingProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('regionSettings')

  return (
    <SettingsCard title={texts.headline}>
      <Typography component='p'>{texts.explanation}</Typography>
      <SettingsCardButtonBox>
        <Button onClick={() => setIsOpen(true)}>{t('open')}</Button>
      </SettingsCardButtonBox>
      {isOpen && (
        <MailTextSettingDialog {...dialogProps} texts={texts} onClose={() => setIsOpen(false)} />
      )}
    </SettingsCard>
  )
}

export default MailTextSettingCard
