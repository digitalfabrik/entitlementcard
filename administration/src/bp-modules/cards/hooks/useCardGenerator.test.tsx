import { MockedProvider as ApolloProvider } from '@apollo/client/testing'
import { OverlayToaster } from '@blueprintjs/core'
import { act, renderHook } from '@testing-library/react'
import { ReactElement } from 'react'

import CardBlueprint from '../../../cards/CardBlueprint'
import * as PdfFactory from '../../../cards/PdfFactory'
import * as createCards from '../../../cards/createCards'
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

  it('should successfully create multiple cards', async () => {
    const createCardsSpy = spyOn(createCards, 'default')
    const toasterSpy = spyOn(OverlayToaster.prototype, 'show')

    const { result } = renderHook(() => useCardGenerator(region), { wrapper })

    act(() => result.current.setCardBlueprints(cards))

    expect(result.current.cardBlueprints).toEqual(cards)
    await act(async () => {
      await result.current.generateCards()
    })

    expect(toasterSpy).not.toHaveBeenCalled()
    expect(createCardsSpy).toHaveBeenCalled()
    expect(result.current.state).toBe(CardActivationState.finished)
    expect(result.current.cardBlueprints).toEqual([])
  })

  it('should show error message for failed card generation', async () => {
    const toasterSpy = spyOn(OverlayToaster.prototype, 'show')
    spyOn(createCards, 'default').and.throwError(new createCards.CreateCardsError('error'))

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
    spyOn(PdfFactory, 'generatePdf').and.throwError(new PdfFactory.PDFError('error'))
    const toasterSpy = spyOn(OverlayToaster.prototype, 'show')

    const { result } = renderHook(() => useCardGenerator(region), { wrapper: wrapper })

    act(() => result.current.setCardBlueprints(cards))

    expect(result.current.cardBlueprints).toEqual(cards)
    await act(async () => {
      await result.current.generateCards()
    })

    expect(toasterSpy).toHaveBeenCalledWith(jasmine.objectContaining({ intent: 'danger' }))
    expect(result.current.state).toBe(CardActivationState.input)
    expect(result.current.cardBlueprints).toEqual([])
  })
})
