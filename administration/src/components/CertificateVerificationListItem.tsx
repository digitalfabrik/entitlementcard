import { Typography, useTheme } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateVerification } from '../util/certificateVerifications'
import { VerificationStatus } from '../util/verifications'
import { AttachmentValue } from './JsonFieldElemental'
import VerificationDetails from './VerificationDetails'
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
      <VerificationDetails
        rows={[
          { label: t('organization'), value: verification.organizationName },
          {
            label: t('application:certificate'),
            value: (
              <AttachmentValue
                attachment={verification.certificate.value}
                baseUrl={baseUrl}
                attachmentAccessible={attachmentAccessible}
              />
            ),
          },
          {
            label: t('status'),
            value: (
              <>
                <VerificationIcon status={VerificationStatus.Verified} /> {t('verified')}
              </>
            ),
          },
        ]}
      />
    </Typography>
  )
}

export default CertificateVerificationListItem
