import { describe, expect, it, vi } from 'vitest'

import { config as nuernbergConfig } from '../../../project-configs/nuernberg/config'
import { activityLogCardExample } from '../__mocks__/ActivityLogData'
import { loadActivityLog, saveActivityLog } from './activityLog'

vi.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('ActivityLog', () => {
  it('should save activity log session storage', () => {
    const setItemSpy = vi.spyOn(Object.getPrototypeOf(sessionStorage), 'setItem')
    saveActivityLog(activityLogCardExample)
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledWith(
      'activity-log',
      '[{"timestamp":"2024-01-01T00:00:00Z","card":{"id":732401,"fullName":"Thea Test","expirationDate":"2026-01-01","extensions":{"startDay":"2025-01-01","birthday":"2000-02-01","nuernbergPassId":"3132222","addressLine1":"","addressLine2":"","addressPlz":"","addressLocation":"","regionId":"93"}}}]',
    )
  })

  it('should properly load activity log from session storage', () => {
    const getItemSpy = vi.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem')
    saveActivityLog(activityLogCardExample)
    loadActivityLog(nuernbergConfig.card)
    expect(getItemSpy).toHaveBeenCalledWith('activity-log')
  })
})
