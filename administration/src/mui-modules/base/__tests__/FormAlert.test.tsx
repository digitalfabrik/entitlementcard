import { render } from '@testing-library/react'

import FormAlert from '../FormAlert'

describe('FormAlert', () => {
  it('should not render when errorMessage is null', () => {
    const { container } = render(<FormAlert errorMessage={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render error message', () => {
    const testMessage = 'Test error message'
    const { getByText } = render(<FormAlert errorMessage={testMessage} />)

    const messageElement = getByText(testMessage)
    expect(messageElement).toBeTruthy()
  })
})
