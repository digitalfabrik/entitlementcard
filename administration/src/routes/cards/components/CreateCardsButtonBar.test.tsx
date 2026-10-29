import { act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { initializeCard } from '../../../cards/card'
import { config } from '../../../project-configs/bayern/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import { getTestRegion } from '../../user-settings/__mocks__/Region'
import CreateCardsButtonBar from './CreateCardsButtonBar'

vi.useFakeTimers()

const mockProvider: CustomRenderOptions = { translation: true, theme: true }

describe('CreateCardsButtonBar', () => {
  const region = getTestRegion({})

  it('Should goBack when clicking back', async () => {
    const goBack = vi.fn()
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={goBack}
        cards={[]}
        generateCardsPdf={() => Promise.resolve()}
        generateCardsCsv={() => Promise.resolve()}
      />,
      mockProvider,
    )

    const backButton = getByText('Zurück zur Auswahl')
    expect(backButton).toBeTruthy()

    fireEvent.click(backButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(goBack).toHaveBeenCalled()
  })

  it('Should disable generate button for no cards', async () => {
    const generateCardsPdf = vi.fn()
    const generateCardsCsv = vi.fn()
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={[]}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      mockProvider,
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()
    expect(generateButton.disabled).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(getByText('Legen Sie zunächst eine Karte an.')).toBeTruthy()
    expect(generateCardsPdf).not.toHaveBeenCalled()
  })

  it('Should disable generate button for invalid cards', async () => {
    const generateCardsPdf = vi.fn()
    const generateCardsCsv = vi.fn()
    const cards = [initializeCard(config.card, region, { fullName: '' })]
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={cards}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      mockProvider,
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(generateButton.disabled).toBeTruthy()
    expect(getByText('Mindestens eine Karte enthält ungültige Eingaben.')).toBeTruthy()
    expect(generateCardsPdf).not.toHaveBeenCalled()
  })

  it('Should generate valid cards', async () => {
    const generateCardsPdf = vi.fn()
    const generateCardsCsv = vi.fn()
    const cards = [initializeCard(config.card, region, { fullName: 'Thea Test' })]
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={cards}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      mockProvider,
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.click(generateButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(generateCardsPdf).toHaveBeenCalled()
  })
})
