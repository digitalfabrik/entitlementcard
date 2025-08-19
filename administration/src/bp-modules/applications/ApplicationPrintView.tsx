import { Stack, Typography, css } from '@mui/material'
import React, { ReactElement, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ApplicationAdmin, ApplicationVerificationView } from '../../generated/graphql'
import { ApplicationParsedJsonValue } from '../../shared/application'
import JsonFieldView from '../../shared/components/JsonFieldView'
import VerificationsView from '../../shared/components/VerificationsView'

export const applicationPrintViewPageStyle = css`
  @page {
    size: A4;
    margin: 2cm;

    @bottom-right {
      content: counter(page);
    }
  }

  hr {
    display: block;
    height: 1pt;
    background: transparent;
    width: 100%;
    border: none;
    border-top: solid 1px #aaa;
  }
`

/** A component displaying a single application specifically for printing. */
export const ApplicationPrintView = forwardRef<
  HTMLDivElement,
  {
    // eslint-disable-next-line react/no-unused-prop-types
    application: Pick<ApplicationParsedJsonValue<ApplicationAdmin>, 'createdDate' | 'jsonValue' | 'id' | 'status'> & {
      verifications: Pick<
        ApplicationVerificationView,
        'organizationName' | 'contactEmailAddress' | 'verificationId' | 'rejectedDate' | 'verifiedDate'
      >[]
    }
  }
>((p, ref): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <Stack ref={ref} sx={{ gap: 4 }}>
      <Typography variant='h4'>{t('applicationFrom', { date: new Date(p.application.createdDate) })}</Typography>
      <JsonFieldView
        jsonField={p.application.jsonValue}
        baseUrl=''
        key={0}
        hierarchyIndex={0}
        attachmentAccessible
        expandedRoot={false}
      />
      <VerificationsView application={p.application} isAdminView />
    </Stack>
  )
})
