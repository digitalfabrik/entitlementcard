import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { OverlayToaster } from '@blueprintjs/core'
import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { ProjectConfigProvider } from '../../../../project-configs/ProjectConfigContext'
import koblenzConfig from '../../../../project-configs/koblenz/config'
import downloadDataUri from '../../../../util/downloadDataUri'
import { AppToasterProvider } from '../../../AppToaster'
import { exampleCard, mockedCardMutation } from '../../__mock__/mockSelfServiceCard'
import useCardGeneratorSelfService, { CardSelfServiceStep } from '../useCardGeneratorSelfService'

const mocks: MockedResponse[] = []

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AppToasterProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectConfigProvider projectConfig={koblenzConfig}>{children}</ProjectConfigProvider>
      </MockedProvider>
    </AppToasterProvider>
  </MemoryRouter>
)

jest.mock('../../../../generated/graphql', () => ({
  ...jest.requireActual('../../../../generated/graphql'),
  generatePdf: jest.fn(),
}))

jest.mock('../../../../cards/PdfFactory', () => ({
  ...jest.requireActual('../../../../cards/PdfFactory'),
  generatePdf: jest.fn(),
}))

jest.mock('../../../../util/downloadDataUri')

describe('useCardGeneratorSelfService', () => {
  it('should successfully create a card', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    mocks.push(mockedCardMutation)

    const { result } = renderHook(() => useCardGeneratorSelfService(), { wrapper })
    act(() => result.current.setSelfServiceCard(exampleCard))
    expect(result.current.selfServiceCard).toEqual(exampleCard)
    await act(async () => result.current.generateCards())
    expect(toasterSpy).not.toHaveBeenCalled()
    expect(result.current.selfServiceState).toBe(CardSelfServiceStep.information)
    expect(result.current.deepLink).toBe(
      'koblenzpass://koblenz.sozialpass.app/activation/code#ClcKLQoNS2FybGEgS29ibGVuehDmnwEaGAoCCF8SBAjqvgEqBAiLmgEyBgoEMTIzSxIQL%2Fle3xYGNIKS50god4ITmxoUOUYGq%2FjAE99bK4edMPo2I3ojr78%3D/'
    )
    await act(async () => result.current.downloadPdf(result.current.code!, 'koblenzpass.pdf'))
    expect(downloadDataUri).toHaveBeenCalled()
  })
})
