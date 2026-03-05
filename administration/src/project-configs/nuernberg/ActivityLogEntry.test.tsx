import { render } from '@testing-library/react'
import React from 'react'
import { Temporal } from 'temporal-polyfill'

import { activityLogCardExample } from '../../routes/activity-log/__mocks__/ActivityLogData'
import ActivityLogEntry from './ActivityLogEntry'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
describe('ActivityLogEntry', () => {
  it('should render the correct log entry content', () => {
    const { getByText } = render(
      <ActivityLogEntry
        logEntry={{
          timestamp: Temporal.Instant.from('2024-01-01T12:00:00.000Z'),
          card: activityLogCardExample,
        }}
      />,
    )
    expect(getByText('01.01.2024, 12:00:00')).toBeTruthy()
    expect(getByText('Thea Test')).toBeTruthy()
    expect(getByText('3132222')).toBeTruthy()
    expect(getByText('01.02.2000')).toBeTruthy()
    expect(getByText('01.01.2026')).toBeTruthy()
  })
})
