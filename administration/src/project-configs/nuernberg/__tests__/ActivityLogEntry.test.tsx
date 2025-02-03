import { render } from '@testing-library/react'
import React from 'react'

import { activityLogCardExample } from '../../../bp-modules/user-settings/__mocks__/ActivityLogData'
import ActivityLogEntry from '../ActivityLogEntry'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
describe('ActivityLogEntry', () => {
  it('should render the correct log entry content', () => {
    const { getByTestId } = render(<ActivityLogEntry timestamp={new Date()} card={activityLogCardExample} />)
    expect(getByTestId('activity-log-entry-timestamp').textContent).toBe('1/1/2024, 12:00:00 AM')
    expect(getByTestId('activity-log-entry-fullname').textContent).toBe('Thea Test')
    expect(getByTestId('activity-log-entry-pass-id').textContent).toBe('3132222')
    expect(getByTestId('activity-log-entry-birthday').textContent).toBe('01.02.2000')
    expect(getByTestId('activity-log-entry-expiry').textContent).toBe('01.01.2026')
  })
})
