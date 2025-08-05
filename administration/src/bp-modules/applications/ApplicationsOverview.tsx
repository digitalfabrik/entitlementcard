import { Container } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ApplicationStatus } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import ApplicationCard from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import usePrintApplication from './hooks/usePrintApplication'
import { getPreVerifiedEntitlementType } from './preVerifiedEntitlements'
import type { Application, ApplicationStatusBarItemType } from './types'

export const barItems: { [key in string]: ApplicationStatusBarItemType } = {
  all: {
    barItemI18nKey: 'statusBarAll',
    applicationAdjectiveI18nKey: 'applicationAdjectiveAll',
    filter: (_: Application): boolean => true,
  },
  accepted: {
    barItemI18nKey: 'statusBarAccepted',
    applicationAdjectiveI18nKey: 'applicationAdjectiveAccepted',
    filter: (application: Application): boolean =>
      application.verifications.every(verification => verification.verifiedDate !== null) ||
      getPreVerifiedEntitlementType(application.jsonValue) !== undefined,
  },
  rejected: {
    barItemI18nKey: 'statusBarRejected',
    applicationAdjectiveI18nKey: 'applicationAdjectiveRejected',
    filter: (application: Application): boolean =>
      application.verifications.every(verification => verification.rejectedDate !== null),
  },
  withdrawn: {
    barItemI18nKey: 'statusBarWithdrawn',
    applicationAdjectiveI18nKey: 'applicationAdjectiveWithdrawn',
    filter: (application: Application): boolean => application.status === ApplicationStatus.Withdrawn,
  },
  open: {
    barItemI18nKey: 'statusBarOpen',
    applicationAdjectiveI18nKey: 'applicationAdjectiveOpen',
    filter: (application: Application): boolean =>
      application.verifications.every(
        verification => verification.verifiedDate === null && verification.rejectedDate === null
      ) &&
      getPreVerifiedEntitlementType(application.jsonValue) === undefined &&
      application.status !== ApplicationStatus.Withdrawn,
  },
}

/** Determines the order within a category */
const applicationListOrder = (application: Application): number => {
  if (barItems.accepted.filter(application)) {
    return 0
  }
  if (barItems.rejected.filter(application)) {
    return 1
  }
  if (barItems.withdrawn.filter(application)) {
    return 2
  }
  return Number.MAX_SAFE_INTEGER // Sort last
}

const ApplicationList = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  gap: 16px;
  // This fixes a whitespace issue in print dialog when using motion #2375
  @media print {
    gap: 0;
  }
`

const ApplicationsOverview = ({ applications }: { applications: Application[] }): ReactElement => {
  const [updatedApplications, setUpdatedApplications] = useState(applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems.all)
  const { t } = useTranslation('applicationsOverview')
  const filteredApplications: Application[] = useMemo(
    () =>
      updatedApplications
        .filter(application => activeBarItem.filter(application))
        // Sort by status and within this status by creation date ascending
        .sort(
          (a, b): number =>
            // Sort by status
            applicationListOrder(a) - applicationListOrder(b) ||
            // If status is equal, sort by date
            new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        ),
    [activeBarItem, updatedApplications]
  )

  return (
    <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxWidth: '90%', width: '1000px' }}>
      <ApplicationStatusBar
        applications={updatedApplications}
        activeBarItem={activeBarItem}
        onSetActiveBarItem={setActiveBarItem}
        barItems={Object.values(barItems)}
      />
      {filteredApplications.length > 0 ? (
        <ApplicationList>
          <AnimatePresence initial={false}>
            {filteredApplications.map(application => (
              <motion.div
                key={application.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}>
                <ApplicationCard
                  isSelectedForPrint={application.id === applicationIdForPrint}
                  application={application}
                  onPrintApplicationById={printApplicationById}
                  onDelete={() => setUpdatedApplications(updatedApplications.filter(a => a !== application))}
                  onChange={changed =>
                    setUpdatedApplications(
                      updatedApplications.map(original => (original.id === changed.id ? changed : original))
                    )
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </ApplicationList>
      ) : (
        <AlertBox
          severity='info'
          title={t('noApplicationsOfType', { status: t(activeBarItem.applicationAdjectiveI18nKey) })}
          description={t('noApplicationsOfTypeDescription', { status: t(activeBarItem.applicationAdjectiveI18nKey) })}
        />
      )}
    </Container>
  )
}

export default ApplicationsOverview
