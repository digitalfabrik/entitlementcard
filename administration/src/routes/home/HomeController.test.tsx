import React from 'react'

import { Role } from '../../generated/graphql'
import { config as bayernConfig } from '../../project-configs/bayern/config'
import { config as koblenzConfig } from '../../project-configs/koblenz/config'
import { config as nuernbergConfig } from '../../project-configs/nuernberg/config'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import { renderWithOptions } from '../../testing/render'
import HomeController from './HomeController'

jest.mock('../../provider/WhoAmIProvider', () => ({
  useWhoAmI: jest.fn(),
}))

const mockUseWhoAmI = useWhoAmI as jest.MockedFunction<typeof useWhoAmI>

describe('HomeController', () => {
  describe('when user RegionAdmin is logged in', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.RegionAdmin },
      })
    })

    it('should render the correct NavBar items for bayern', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: bayernConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(getByText('Eingehende Anträge')).toBeTruthy()
      expect(getByText('Karten erstellen')).toBeTruthy()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(getByText('Region verwalten')).toBeTruthy()
      expect(getByText('Statistiken')).toBeTruthy()
    })

    it('should render the correct NavBar items for nuernberg', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: nuernbergConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(getByText('Karten erstellen')).toBeTruthy()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })

    it('should render the correct NavBar items for koblenz', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: koblenzConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })
  })

  describe('when user RegionManager is logged in', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.RegionManager },
      })
    })

    it('should render the correct NavBar items bayern', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: bayernConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(queryByText('Benutzer verwalten')).toBeNull()
      expect(getByText('Eingehende Anträge')).toBeTruthy()
      expect(getByText('Karten erstellen')).toBeTruthy()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })

    it('should render the correct NavBar items for nuernberg', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: nuernbergConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(queryByText('Benutzer verwalten')).toBeNull()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(getByText('Karten erstellen')).toBeTruthy()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })

    it('should render the correct NavBar items for koblenz', async () => {
      const { queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: koblenzConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(queryByText('Benutzer verwalten')).toBeNull()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })
  })

  describe('when user ProjectAdmin is logged in', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.ProjectAdmin },
      })
    })

    it('should render the correct NavBar items for bayern', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: bayernConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(getByText('Statistiken')).toBeTruthy()
    })

    it('should render the correct NavBar items for nuernberg', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: nuernbergConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(queryByText('Projekt verwalten')).toBeNull()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })

    it('should render the correct NavBar items for koblenz', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: koblenzConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(getByText('Benutzer verwalten')).toBeTruthy()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(getByText('Projekt verwalten')).toBeTruthy()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })
  })

  describe('when user ExternalVerifiedApiUser is logged in', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.ExternalVerifiedApiUser },
      })
    })

    it('should render the correct NavBar items for bayern', async () => {
      const { getByText, queryByText } = renderWithOptions(<HomeController />, {
        router: true,
        projectConfig: bayernConfig,
      })
      expect(queryByText('Akzeptanzpartner verwalten')).toBeNull()
      expect(queryByText('Benutzer verwalten')).toBeNull()
      expect(queryByText('Eingehende Anträge')).toBeNull()
      expect(queryByText('Karten erstellen')).toBeNull()
      expect(getByText('Projekt verwalten')).toBeTruthy()
      expect(queryByText('Region verwalten')).toBeNull()
      expect(queryByText('Statistiken')).toBeNull()
    })
  })

  describe('when user ProjectStoreManager is logged in', () => {
    beforeEach(() => {
      mockUseWhoAmI.mockReturnValue({
        // @ts-expect-error - no need for other properties
        me: { role: Role.ProjectStoreManager },
      })
    })
    const projectConfigsWithStoreUpload = [
      { projectConfig: nuernbergConfig },
      { projectConfig: koblenzConfig },
    ]
    it.each(projectConfigsWithStoreUpload)(
      `should render the correct NavBar items for $projectConfig.name`,
      ({ projectConfig }) => {
        const { getByText, queryByText } = renderWithOptions(<HomeController />, {
          router: true,
          projectConfig,
        })
        expect(getByText('Akzeptanzpartner verwalten')).toBeTruthy()
        expect(queryByText('Benutzer verwalten')).toBeNull()
        expect(queryByText('Eingehende Anträge')).toBeNull()
        expect(queryByText('Karten erstellen')).toBeNull()
        expect(queryByText('Projekt verwalten')).toBeNull()
        expect(queryByText('Region verwalten')).toBeNull()
        expect(queryByText('Statistiken')).toBeNull()
      },
    )
  })
})
