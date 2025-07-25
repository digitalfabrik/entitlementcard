import { Stack } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ApplicationStatus } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import ApplicationCard from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import usePrintApplication from './hooks/usePrintApplication'
import type { Application, ApplicationStatusBarItemType } from './types'

const countApprovedVerifications = (application: Application): number =>
  application.verifications.reduce((count, verification) => count + (verification.verifiedDate !== null ? 1 : 0), 0)

const countRejectingVerifications = (application: Application): number =>
  application.verifications.reduce((count, verification) => count + (verification.rejectedDate !== null ? 1 : 0), 0)

const applicationWithdrawn = (application: Application): boolean => application.status === ApplicationStatus.Withdrawn

const applicationApproved = (application: Application): boolean =>
  countApprovedVerifications(application) > 0 && countRejectingVerifications(application) === 0

const applicationRejected = (application: Application): boolean =>
  countApprovedVerifications(application) === 0 && countRejectingVerifications(application) > 0

const applicationOpen = (application: Application): boolean =>
  countApprovedVerifications(application) === 0 && countRejectingVerifications(application) === 0

const applicationAmbiguous = (application: Application): boolean =>
  countApprovedVerifications(application) > 0 && countRejectingVerifications(application) > 0

const applicationListOrder = (application: Application): number => {
  if (applicationAmbiguous(application)) {
    return 1
  }
  if (applicationWithdrawn(application)) {
    return 2
  }
  if (applicationRejected(application)) {
    return 3
  }
  if (applicationApproved(application)) {
    return 4
  }
  return 0
}

export const barItems: ApplicationStatusBarItemType[] = [
  {
    i18nKey: 'allApplications',
    filter: _ => true,
  },
  {
    i18nKey: 'accepted',
    filter: applicationApproved,
  },
  {
    i18nKey: 'rejected',
    filter: applicationRejected,
  },
  {
    i18nKey: 'withdrawn',
    filter: applicationWithdrawn,
  },
  {
    i18nKey: 'open',
    filter: applicationOpen,
  },
]

const ApplicationsOverview = ({ applications }: { applications: Application[] }): ReactElement => {
  const [updatedApplications, setUpdatedApplications] = useState(applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems[0])
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
    <Stack sx={{ flexGrow: 1, maxWidth: '90%', width: '1000px', gap: 2, '@media print': { gap: 0 } }}>
      <ApplicationStatusBar
        applications={updatedApplications}
        activeBarItem={activeBarItem}
        onSetActiveBarItem={setActiveBarItem}
        barItems={barItems}
      />
      {filteredApplications.length > 0 ? (
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
      ) : (
        <AlertBox
          severity='info'
          title={t('noApplicationsOfType', { status: activeBarItem.i18nKey })}
          description={t('noApplicationsOfTypeDescription', { status: activeBarItem.i18nKey })}
        />
      )}
    </Stack>
  )
}

export default ApplicationsOverview
