import { MockedProvider as ApolloProvider } from '@apollo/client/testing'
import { OverlayToaster } from '@blueprintjs/core'
import { act, renderHook } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { ReactElement } from 'react'

import CardBlueprint from '../../../cards/CardBlueprint'
import { PDFError, generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError } from '../../../cards/createCards'
import { DynamicActivationCode } from '../../../generated/card_pb'
import { Region } from '../../../generated/graphql'
import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import bayernConfig from '../../../project-configs/bayern/config'
import { AppToasterProvider } from '../../AppToaster'
import useCardGenerator, { CardActivationState } from './useCardGenerator'

const wrapper = ({ children }: { children: ReactElement }) => {
  return (
    <AppToasterProvider>
      <ApolloProvider>
        <ProjectConfigProvider>{children}</ProjectConfigProvider>
      </ApolloProvider>
    </AppToasterProvider>
  )
}

jest.mock('../../../cards/PdfFactory', () => ({
  ...jest.requireActual('../../../cards/PdfFactory'),
  generatePdf: jest.fn(),
}))
jest.mock('../../../cards/createCards', () => ({
  ...jest.requireActual('../../../cards/createCards'),
  __esModule: true,
  default: jest.fn(),
}))

describe('useCardGenerator', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
  }

  const cards = [
    new CardBlueprint('Thea Test', bayernConfig.card, [region]),
    new CardBlueprint('Thea Test', bayernConfig.card, [region]),
  ]
  const codes = [
    {
      dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
      dynamicActivationCode: new DynamicActivationCode({ info: cards[0].generateCardInfo() }),
    },
    {
      dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
      dynamicActivationCode: new DynamicActivationCode({ info: cards[1].generateCardInfo() }),
    },
  ]

  it('should successfully create multiple cards', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    const { result } = renderHook(() => useCardGenerator(region), { wrapper })

    act(() => result.current.setCardBlueprints(cards))

    expect(result.current.cardBlueprints).toEqual(cards)
    await act(async () => {
      await result.current.generateCards()
    })

    expect(toasterSpy).not.toHaveBeenCalled()
    expect(createCards).toHaveBeenCalled()
    expect(result.current.state).toBe(CardActivationState.finished)
    expect(result.current.cardBlueprints).toEqual([])
  })

  it('should show error message for failed card generation', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(createCards).mockImplementationOnce(() => {
      throw new CreateCardsError('error')
    })

    const { result } = renderHook(() => useCardGenerator(region), { wrapper: wrapper })

    act(() => result.current.setCardBlueprints(cards))

    expect(result.current.cardBlueprints).toEqual(cards)
    await act(async () => {
      await result.current.generateCards()
    })

    expect(toasterSpy).toHaveBeenCalledWith({ message: 'error', intent: 'danger' })
    expect(result.current.state).toBe(CardActivationState.input)
    expect(result.current.cardBlueprints).toEqual([])
  })

  it('should show error message for failed pdf generation', async () => {
    mocked(createCards).mockReturnValueOnce(Promise.resolve(codes))
    mocked(generatePdf).mockImplementationOnce(() => {
      throw new PDFError('error')
    })
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')

    const { result } = renderHook(() => useCardGenerator(region), { wrapper: wrapper })

    act(() => result.current.setCardBlueprints(cards))

    expect(result.current.cardBlueprints).toEqual(cards)
    await act(async () => {
      await result.current.generateCards()
    })

    expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ intent: 'danger' }))
    expect(result.current.state).toBe(CardActivationState.input)
    expect(result.current.cardBlueprints).toEqual([])
  })
})
