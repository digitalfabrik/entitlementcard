import { render } from '@testing-library/react'
import React from 'react'

import { activityLogCardExample } from '../../../bp-modules/activity-log/__mocks__/ActivityLogData'
import ActivityLogEntry from '../ActivityLogEntry'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
describe('ActivityLogEntry', () => {
  it('should render the correct log entry content', () => {
    const { getByText } = render(<ActivityLogEntry timestamp={new Date()} card={activityLogCardExample} />)
    expect(getByText('1/1/2024, 12:00:00 AM')).toBeTruthy()
    expect(getByText('Thea Test')).toBeTruthy()
    expect(getByText('3132222')).toBeTruthy()
    expect(getByText('01.02.2000')).toBeTruthy()
    expect(getByText('01.01.2026')).toBeTruthy()
  })
})
