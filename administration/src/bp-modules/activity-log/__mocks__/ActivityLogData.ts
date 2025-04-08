import { initializeCard } from '../../../cards/Card'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import PlainDate from '../../../util/PlainDate'
import { getTestRegion } from '../../user-settings/__mocks__/Region'
import { ActivityLogEntryType } from '../ActivityLog'

const region = getTestRegion({
  id: 93,
  name: 'Stadt Nürnberg',
  prefix: 'nbg',
  activatedForApplication: false,
  activatedForCardConfirmationMail: false,
})
export const activityLogCardExample = initializeCard(nuernbergConfig.card, region, {
  id: 732401,
  fullName: 'Thea Test',
  expirationDate: PlainDate.from('2026-01-01'),
  extensions: {
    nuernbergPassId: 3132222,
    birthday: PlainDate.from('2000-02-01'),
    startDay: PlainDate.from('2025-01-01'),
  },
})

export const activityLogCardExample2 = initializeCard(nuernbergConfig.card, region, {
  id: 7324321,
  fullName: 'Thea Test',
  expirationDate: PlainDate.from('2026-01-01'),
  extensions: {
    nuernbergPassId: 3132132,
    birthday: PlainDate.from('2005-02-01'),
    startDay: PlainDate.from('2025-05-01'),
  },
})
export const activityLogEntries: ActivityLogEntryType[] = [
  { card: activityLogCardExample, timestamp: new Date() },
  { card: activityLogCardExample2, timestamp: new Date() },
]
