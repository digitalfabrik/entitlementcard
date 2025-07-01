import { Stack } from '@mui/material'
import { TFunction } from 'i18next'
import { AnimatePresence, motion } from 'motion/react'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../../mui-modules/base/AlertBox'
import ApplicationCard from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import usePrintApplication from './hooks/usePrintApplication'
import { ApplicationStatusBarItemType, ApplicationVerificationStatus, GetApplicationsType } from './types'
import { applicationEffectiveStatus } from './utils'

export const barItems: ApplicationStatusBarItemType[] = [
  {
    title: 'allApplications',
    status: undefined,
  },
  {
    title: 'accepted',
    status: ApplicationVerificationStatus.Approved,
  },
  {
    title: 'rejected',
    status: ApplicationVerificationStatus.Rejected,
  },
  {
    title: 'withdrawn',
    status: ApplicationVerificationStatus.Withdrawn,
  },
  {
    title: 'open',
    status: ApplicationVerificationStatus.Ambiguous,
  },
]

const getEmptyApplicationsListStatusDescription = (activeBarItem: ApplicationStatusBarItemType, t: TFunction): string =>
  activeBarItem.status !== undefined ? `${t(activeBarItem.title).toLowerCase()}en` : ''

const ApplicationsOverview = ({ applications }: { applications: GetApplicationsType[] }): ReactElement => {
  const [updatedApplications, setUpdatedApplications] = useState(applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems[0])
  const { t } = useTranslation('applicationsOverview')
  const filteredApplications: GetApplicationsType[] = useMemo(
    () =>
      updatedApplications
        .filter(a => activeBarItem.status === undefined || applicationEffectiveStatus(a) === activeBarItem.status)
        // Sort by status and within this status by creation date ascending
        .sort(
          (a, b): number =>
            // Sort by status
            applicationEffectiveStatus(a) - applicationEffectiveStatus(b) ||
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
        setActiveBarItem={setActiveBarItem}
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
          title={t('noApplicationsOfType', { status: getEmptyApplicationsListStatusDescription(activeBarItem, t) })}
          description={t('noApplicationsOfTypeDescription', {
            status: getEmptyApplicationsListStatusDescription(activeBarItem, t),
          })}
        />
      )}
    </Stack>
  )
}

export default ApplicationsOverview
