import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import { config } from '../../../project-configs/koblenz/config'
import { AppSnackbarProvider } from '../../../provider/AppSnackbarProvider'
import downloadDataUri from '../../../util/downloadDataUri'
import { exampleCard, mockedCardMutation } from '../__mock__/mockSelfServiceCard'
import useCardGeneratorSelfService from './useCardGeneratorSelfService'

const mocks: MockedResponse[] = []

jest.mock('../../../generated/graphql', () => ({
  ...jest.requireActual('../../../generated/graphql'),
  generatePdf: jest.fn(),
}))

jest.mock('../../../cards/pdf/pdfFactory', () => ({
  ...jest.requireActual('../../../cards/pdf/pdfFactory'),
  generatePdf: jest.fn(),
}))

jest.mock('../../../util/downloadDataUri')

const enqueueSnackbarMock = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: enqueueSnackbarMock,
  }),
}))

const wrapper = ({
  children,
  initialRoutes,
}: {
  children: ReactNode
  initialRoutes?: string[]
}) => (
  <MemoryRouter initialEntries={initialRoutes}>
    <AppSnackbarProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectConfigProvider projectConfig={config}>{children}</ProjectConfigProvider>
      </MockedProvider>
    </AppSnackbarProvider>
  </MemoryRouter>
)

const withCustomWrapper =
  (initialRoute: string) =>
  ({ children }: { children: ReactNode }) =>
    wrapper({
      children,
      initialRoutes: [initialRoute],
    })

describe('useCardGeneratorSelfService', () => {
  beforeEach(jest.resetAllMocks)

  it('should successfully create a card', async () => {
    mocks.push(mockedCardMutation)

    const { result } = renderHook(() => useCardGeneratorSelfService(), { wrapper })
    act(() => result.current.setSelfServiceCard(exampleCard))
    expect(result.current.selfServiceCard).toEqual(exampleCard)
    await act(async () => result.current.generateCards())
    expect(enqueueSnackbarMock).not.toHaveBeenCalled()
    expect(result.current.cardGenerationStep).toBe('information')
    await act(async () => result.current.downloadPdf(result.current.code!, 'koblenzpass.pdf'))
    expect(downloadDataUri).toHaveBeenCalled()
  })

  it('should successfully initialize cards with searchParams for koblenz', async () => {
    jest.useFakeTimers({ now: new Date('2025-01-01T00:00:00.000Z') })
    const { result } = renderHook(() => useCardGeneratorSelfService(), {
      wrapper: withCustomWrapper('?Name=Karla Koblenz&Referenznummer=123K&Geburtsdatum=10.06.2003'),
    })

    expect(result.current.selfServiceCard).toEqual({
      expirationDate: { day: 1, isoMonth: 1, isoYear: 2026 },
      extensions: {
        birthday: {
          day: 10,
          isoMonth: 6,
          isoYear: 2003,
        },
        koblenzReferenceNumber: '123K',
      },
      fullName: 'Karla Koblenz',
      id: expect.any(Number),
    })
  })
})
