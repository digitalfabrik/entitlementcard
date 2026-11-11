import { Typography, useTheme } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateVerification } from '../util/certificateVerifications'
import { VerificationStatus } from '../util/verifications'
import { AttachmentValue } from './JsonFieldElemental'
import { VerificationIcon } from './VerificationIcon'

/** An activity that is verified by an uploaded certificate instead of an organization contact person. */
const CertificateVerificationListItem = ({
  verification,
  baseUrl,
  attachmentAccessible,
}: {
  verification: CertificateVerification
  baseUrl: string
  attachmentAccessible: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()

  return (
    <Typography
      component='li'
      sx={{ borderLeft: `2px solid ${theme.palette.success.main}`, paddingLeft: 1.5 }}
    >
      <table cellPadding='2px'>
        <tbody>
          <tr>
            <td>{t('organization')}:</td>
            <td>{verification.organizationName}</td>
          </tr>
          <tr>
            <td>{t('application:certificate')}:</td>
            <td>
              <AttachmentValue
                attachment={verification.certificate.value}
                baseUrl={baseUrl}
                attachmentAccessible={attachmentAccessible}
              />
            </td>
          </tr>
          <tr>
            <td>{t('status')}:</td>
            <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <VerificationIcon status={VerificationStatus.Verified} /> {t('verified')}
            </td>
          </tr>
        </tbody>
      </table>
    </Typography>
  )
}

export default CertificateVerificationListItem
