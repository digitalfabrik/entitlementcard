import { fireEvent } from '@testing-library/react'
import React from 'react'

import { LOCAL_STORAGE_PROJECT_KEY } from '../../../project-configs/constants'
import koblenzConfig from '../../../project-configs/koblenz/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import CardSelfServiceInformation from '../components/CardSelfServiceInformation'

const goToActivation = jest.fn()

const mockProvider: CustomRenderOptions = { translation: true, theme: true }

describe('CardSelfServiceInformation', () => {
  it('should provide a go to activation button', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)

    const { getByText } = renderWithOptions(
      <CardSelfServiceInformation goToActivation={goToActivation} />,
      mockProvider
    )

    const goNextButton = getByText('Weiter zur Aktivierung')
    fireEvent.click(goNextButton)
    expect(goToActivation).toHaveBeenCalled()
  })

  it('should provide some information texts', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)

    const { getByText } = renderWithOptions(
      <CardSelfServiceInformation goToActivation={goToActivation} />,
      mockProvider
    )

    expect(getByText('Haben sie die App noch nicht?')).toBeTruthy()
    expect(getByText('Laden Sie sie jetzt herunter, um fortzufahren.')).toBeTruthy()
  })
})
