import React from 'react'

import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { renderWithTranslation } from '../../../testing/render'
import ActivityLogTable from '../ActivityLogTable'
import { activityLogEntries } from '../__mocks__/ActivityLogData'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
describe('ActivityLogTable', () => {
  it('should render an empty list, if there are no log entries', () => {
    const { getByText, queryAllByRole } = renderWithTranslation(
      <ActivityLogTable activityLog={[]} activityLogConfig={nuernbergConfig.activityLogConfig!} />
    )
    expect(queryAllByRole('row')[0].textContent).toBe(nuernbergConfig.activityLogConfig!.columnNames.join(''))
    expect(getByText('Keine Einträge vorhanden')).toBeTruthy()
  })

  it('should render the table body with correct amount of entries', () => {
    const { queryByText, queryAllByRole } = renderWithTranslation(
      <ActivityLogTable activityLog={activityLogEntries} activityLogConfig={nuernbergConfig.activityLogConfig!} />
    )
    expect(queryAllByRole('row')[0].textContent).toBe(nuernbergConfig.activityLogConfig!.columnNames.join(''))
    expect(queryByText('Keine Einträge vorhanden')).toBeNull()
    expect(queryAllByRole('row')).toHaveLength(3)
  })
})
