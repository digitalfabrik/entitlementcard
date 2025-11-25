import { render } from '@testing-library/react'
import React from 'react'

import { Role } from '../../generated/graphql'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import { renderWithOptions } from '../../testing/render'
import RenderGuard from '../RenderGuard'

jest.mock('../../provider/WhoAmIProvider', () => ({
  useWhoAmI: jest.fn(),
}))

const mockUseWhoAmI = useWhoAmI as jest.MockedFunction<typeof useWhoAmI>

describe('RenderGuard', () => {
  const mockChildren = <div data-testid='protected-content'>Protected Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when user has valid role', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.RegionAdmin },
      })
    })

    it('should render children when no allowedRoles are specified', () => {
      const { getByTestId } = render(<RenderGuard>{mockChildren}</RenderGuard>)

      expect(getByTestId('protected-content')).toBeTruthy()
    })

    it('should render children when user role is in allowedRoles', () => {
      const { getByTestId } = render(
        <RenderGuard allowedRoles={[Role.RegionAdmin, Role.RegionManager]}>{mockChildren}</RenderGuard>
      )

      expect(getByTestId('protected-content')).toBeTruthy()
    })

    it('should render children when condition is true', () => {
      const { getByTestId } = render(<RenderGuard condition>{mockChildren}</RenderGuard>)

      expect(getByTestId('protected-content')).toBeTruthy()
    })

    it('should not render children when condition is false', () => {
      const { queryByTestId } = render(<RenderGuard condition={false}>{mockChildren}</RenderGuard>)

      expect(queryByTestId('protected-content')).toBeNull()
    })
  })

  describe('when user does not have valid role', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.ProjectStoreManager },
      })
    })

    it('should neither render children nor error when user role is not in allowedRoles and no error is provided', () => {
      const { queryByTestId } = render(
        <RenderGuard allowedRoles={[Role.RegionManager, Role.RegionAdmin]}>{mockChildren}</RenderGuard>
      )

      expect(queryByTestId('protected-content')).toBeNull()
      expect(queryByTestId('alert-box')).toBeNull()
    })

    it('should render error message when user role is not in allowedRoles and error is provided', () => {
      const error = {
        title: 'Custom Error Title',
        description: 'Custom Error Description',
      }

      const { queryByTestId, getByText } = render(
        <RenderGuard allowedRoles={[Role.RegionManager, Role.RegionAdmin]} error={error}>
          {mockChildren}
        </RenderGuard>
      )

      expect(queryByTestId('protected-content')).toBeNull()
      expect(getByText(error.description)).toBeTruthy()
      expect(getByText(error.title)).toBeTruthy()
    })

    it('should render default error message when user role is not in allowedRoles and error object is empty', () => {
      const { getByText, queryByTestId } = renderWithOptions(
        <RenderGuard allowedRoles={[Role.RegionAdmin]} error={{}}>
          {mockChildren}
        </RenderGuard>,
        { translation: true }
      )

      expect(queryByTestId('protected-content')).toBeNull()
      expect(getByText('Fehlende Berechtigung')).toBeTruthy()
      expect(getByText('Sie sind nicht berechtigt, diesen Bereich einzusehen.')).toBeTruthy()
    })

    it('should render partial custom error message when only title is provided', () => {
      const error = {
        title: 'Custom Title Only',
      }

      const { getByText } = render(
        <RenderGuard allowedRoles={[Role.RegionAdmin]} error={error}>
          {mockChildren}
        </RenderGuard>
      )

      expect(getByText('Custom Title Only')).toBeTruthy()
      expect(getByText('Sie sind nicht berechtigt, diesen Bereich einzusehen.')).toBeTruthy()
    })

    it('should render partial custom error message when only description is provided', () => {
      const error = {
        description: 'Custom Description Only',
      }

      const { getByText } = render(
        <RenderGuard allowedRoles={[Role.RegionAdmin]} error={error}>
          {mockChildren}
        </RenderGuard>
      )

      expect(getByText('Fehlende Berechtigung')).toBeTruthy()
      expect(getByText('Custom Description Only')).toBeTruthy()
    })
  })

  describe('when condition is false', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.RegionAdmin },
      })
    })

    it('should return null when condition is false even with valid role', () => {
      const { queryByTestId } = render(
        <RenderGuard condition={false} allowedRoles={[Role.RegionAdmin]}>
          {mockChildren}
        </RenderGuard>
      )

      expect(queryByTestId('protected-content')).toBeNull()
    })

    it('should return error messages when condition is false and error is provided', () => {
      const error = {
        title: 'Error Title',
        description: 'Error Description',
      }

      const { getByText } = render(
        <RenderGuard condition={false} error={error}>
          {mockChildren}
        </RenderGuard>
      )

      expect(getByText('Error Title')).toBeTruthy()
      expect(getByText('Error Description')).toBeTruthy()
    })
  })
})
