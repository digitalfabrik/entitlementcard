import { MockedProvider as ApolloProvider } from '@apollo/client/testing'
import { OverlayToaster } from '@blueprintjs/core'
import { act, renderHook } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { generateCardInfo, initializeCard } from '../../../cards/Card'
import { PdfError, generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import { DynamicActivationCode, StaticVerificationCode } from '../../../generated/card_pb'
import { Region } from '../../../generated/graphql'
import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import bayernConfig from '../../../project-configs/bayern/config'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import koblenzConfig from '../../../project-configs/koblenz/config'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import showcaseConfig from '../../../project-configs/showcase/config'
import downloadDataUri from '../../../util/downloadDataUri'
import { AppToasterProvider } from '../../AppToaster'
import useCardGenerator from './useCardGenerator'

const wrapper = ({
  children,
  initialRoutes,
  projectConfig,
}: {
  children: ReactNode
  projectConfig?: ProjectConfig
  initialRoutes?: string[]
}) => (
  <MemoryRouter initialEntries={initialRoutes}>
    <ProjectConfigProvider projectConfig={projectConfig ?? showcaseConfig}>
      <AppToasterProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </AppToasterProvider>
    </ProjectConfigProvider>
  </MemoryRouter>
)

const withCustomWrapper =
  (initialRoutes: string[], projectConfig: ProjectConfig) =>
  // @ts-expect-error any is okay here
  ({ children }) =>
    wrapper({
      children,
      initialRoutes,
      projectConfig,
    })

jest.mock('../../../cards/PdfFactory', () => ({
  ...jest.requireActual('../../../cards/PdfFactory'),
  generatePdf: jest.fn(),
}))
jest.mock('../../../cards/createCards', () => ({
  ...jest.requireActual('../../../cards/createCards'),
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../../cards/deleteCards')
jest.mock('../../../util/downloadDataUri')

describe('useCardGenerator', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
    activatedForCardConfirmationMail: true,
  }

  const cards = [
    initializeCard(bayernConfig.card, region, { fullName: 'Thea Test' }),
    initializeCard(bayernConfig.card, region, { fullName: 'Thea Test' }),
  ]
  const codes: CreateCardsResult[] = [
    {
      dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
      dynamicActivationCode: new DynamicActivationCode({ info: generateCardInfo(cards[0]) }),
    },
    {
      dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
      dynamicActivationCode: new DynamicActivationCode({ info: generateCardInfo(cards[1]) }),
      staticCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
      staticVerificationCode: new StaticVerificationCode({ info: generateCardInfo(cards[1]) }),
    },
  ]

  beforeEach(jest.resetAllMocks)

  it('should successfully create multiple cards', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    const { result } = renderHook(() => useCardGenerator({ region }), { wrapper })
    act(() => result.current.setCards(cards))

    expect(result.current.cards).toEqual(cards)
    await act(async () => {
      await result.current.generateCardsPdf()
    })

    expect(toasterSpy).not.toHaveBeenCalled()
    expect(createCards).toHaveBeenCalled()
    expect(downloadDataUri).toHaveBeenCalled()
    expect(result.current.cardGenerationStep).toBe('finished')
    expect(result.current.cards).toEqual([])
  })

  it('should show error message for failed card generation', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(createCards).mockImplementation(() => {
      throw new CreateCardsError('error')
    })

    const { result } = renderHook(() => useCardGenerator({ region }), { wrapper })

    act(() => result.current.setCards(cards))

    expect(result.current.cards).toEqual(cards)
    await act(async () => {
      await result.current.generateCardsPdf()
    })

    expect(toasterSpy).toHaveBeenCalledWith({ message: 'error', intent: 'danger' })
    expect(downloadDataUri).not.toHaveBeenCalled()
    expect(result.current.cardGenerationStep).toBe('input')
    expect(result.current.cards).toEqual([])
  })

  it('should show error message and run rollback for failed pdf generation', async () => {
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    mocked(deleteCards).mockReturnValueOnce(Promise.resolve())
    mocked(generatePdf).mockImplementationOnce(() => {
      throw new PdfError('error')
    })
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')

    const { result } = renderHook(() => useCardGenerator({ region }), { wrapper })

    act(() => result.current.setCards(cards))

    expect(result.current.cards).toEqual(cards)
    await act(async () => {
      await result.current.generateCardsPdf()
    })
    /*
    const codesToDelete = [
      codes[0].dynamicCardInfoHashBase64,
      codes[1].staticCardInfoHashBase64,
      codes[1].dynamicCardInfoHashBase64,
    ]
  */
    expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ intent: 'danger' }))
    expect(deleteCards).toHaveBeenCalled()
    // TODO 1869 Finalize translations - fix test to call delete cards with parameters
    // expect(deleteCards).toHaveBeenCalledWith(expect.anything(), region.id, codesToDelete)
    expect(downloadDataUri).not.toHaveBeenCalled()
    expect(result.current.cardGenerationStep).toBe('input')
    expect(result.current.cards).toEqual([])
  })

  it('should successfully initialize cards with searchParams for bavaria', async () => {
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    const { result } = renderHook(() => useCardGenerator({ region }), {
      wrapper: withCustomWrapper(
        [
          '?Name=Thea+Test&Ablaufdatum=26.02.2028&MailNotification=thea.test%40gmail.com&applicationIdToMarkAsProcessed=1',
        ],
        bayernConfig
      ),
    })

    expect(result.current.cards).toEqual([
      {
        expirationDate: { day: 26, isoMonth: 2, isoYear: 2028 },
        extensions: { bavariaCardType: 'Standard', regionId: 0, emailNotification: 'thea.test@gmail.com' },
        fullName: 'Thea Test',
        id: expect.any(Number),
      },
    ])
  })

  it('should successfully initialize cards with searchParams for koblenz', async () => {
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    const { result } = renderHook(() => useCardGenerator({ region }), {
      wrapper: withCustomWrapper(['?Name=Karla Koblenz&Referenznummer=123K&Geburtsdatum=10.06.2003'], koblenzConfig),
    })

    expect(result.current.cards).toEqual([
      {
        expirationDate: { day: 26, isoMonth: 2, isoYear: 2026 },
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
      },
    ])
  })

  it('should successfully initialize cards with searchParams for nuernberg', async () => {
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    const { result } = renderHook(() => useCardGenerator({ region }), {
      wrapper: withCustomWrapper(
        [
          '?Name=Thea+Test&Ablaufdatum=03.3.2026&Geburtsdatum=01.01.2000&Passnummer=12345678&Pass-ID=123&Adresszeile+1=Teststraße+3&Adresszeile+2=EG+Rechts&PLZ=86111&Ort=Musterstadt',
        ],
        nuernbergConfig
      ),
    })

    expect(result.current.cards).toEqual([
      {
        expirationDate: { day: 3, isoMonth: 3, isoYear: 2026 },
        extensions: {
          birthday: {
            day: 1,
            isoMonth: 1,
            isoYear: 2000,
          },
          addressLine1: 'Teststraße 3',
          addressLine2: 'EG Rechts',
          addressLocation: 'Musterstadt',
          addressPlz: '86111',
          nuernbergPassId: 123,
          regionId: 0,
          startDay: { day: 26, isoMonth: 2, isoYear: 2025 },
        },
        fullName: 'Thea Test',
        id: expect.any(Number),
      },
    ])
  })
})
