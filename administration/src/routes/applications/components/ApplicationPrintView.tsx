import { Box, Stack, Typography, css } from '@mui/material'
import React, { ReactElement, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import JsonFieldView from '../../../components/JsonFieldView'
import VerificationsView from '../../../components/VerificationsView'
import {
  ApplicationAdmin,
  ApplicationStatus,
  ApplicationVerificationView,
} from '../../../generated/graphql'
import { ApplicationParsedJsonValue } from '../utils/application'
import { ApplicationStatusNote } from './ApplicationStatusNote'

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
    application: Pick<
      ApplicationParsedJsonValue<ApplicationAdmin>,
      'createdDate' | 'jsonValue' | 'id' | 'status' | 'statusResolvedDate' | 'rejectionMessage'
    > & {
      verifications: Pick<
        ApplicationVerificationView,
        | 'organizationName'
        | 'contactEmailAddress'
        | 'verificationId'
        | 'rejectedDate'
        | 'verifiedDate'
      >[]
    }
  }
>((p, ref): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <Stack ref={ref} sx={{ gap: 4 }}>
      <Typography variant='h6' marginY={0}>
        {t('applicationFrom', { date: new Date(p.application.createdDate) })}
      </Typography>

      {p.application.status === ApplicationStatus.Withdrawn &&
        !!p.application.statusResolvedDate && (
          <Box
            sx={{
              border: '1pt solid black',
              borderRadius: '4pt',
              padding: 2,
              width: 'fit-content',
            }}
          >
            <Typography>
              {' '}
              {t('withdrawalMessage', { date: new Date(p.application.statusResolvedDate) })}
              <br />
              {t('deleteApplicationSoonPrompt')}
            </Typography>
          </Box>
        )}
      <hr />
      <JsonFieldView
        jsonField={p.application.jsonValue}
        baseUrl=''
        key={0}
        hierarchyIndex={0}
        attachmentAccessible
        expandedRoot
      />
      <hr />
      <VerificationsView application={p.application} isAdminView />
      <hr />
      {p.application.statusResolvedDate != null && (
        <ApplicationStatusNote
          statusResolvedDate={new Date(p.application.statusResolvedDate)}
          status={p.application.status}
          reason={p.application.rejectionMessage ?? undefined}
          adminView
        />
      )}
    </Stack>
  )
})
