import { act, fireEvent } from '@testing-library/react'
import React from 'react'

import { initializeCard } from '../../cards/Card'
import bayernConfig from '../../project-configs/bayern/config'
import { renderWithOptions } from '../../testing/render'
import { getTestRegion } from '../user-settings/__mocks__/Region'
import CreateCardsButtonBar from './CreateCardsButtonBar'

jest.useFakeTimers()

describe('CreateCardsButtonBar', () => {
  const region = getTestRegion({})

  it('Should goBack when clicking back', async () => {
    const goBack = jest.fn()
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={goBack}
        cards={[]}
        generateCardsPdf={() => Promise.resolve()}
        generateCardsCsv={() => Promise.resolve()}
      />,
      { translation: true, theme: true }
    )

    const backButton = getByText('Zurück zur Auswahl')
    expect(backButton).toBeTruthy()

    fireEvent.click(backButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(goBack).toHaveBeenCalled()
  })

  it('Should disable generate button for no cards', async () => {
    const generateCardsPdf = jest.fn()
    const generateCardsCsv = jest.fn()
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={[]}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      { translation: true, theme: true }
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()
    expect(generateButton.disabled).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)
    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(getByText('Legen Sie zunächst eine Karte an.')).toBeTruthy()
    expect(generateCardsPdf).not.toHaveBeenCalled()
  })

  it('Should disable generate button for invalid cards', async () => {
    const generateCardsPdf = jest.fn()
    const generateCardsCsv = jest.fn()
    const cards = [initializeCard(bayernConfig.card, region, { fullName: '' })]
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={cards}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      { translation: true, theme: true }
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)

    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(generateButton.disabled).toBeTruthy()
    expect(getByText('Mindestens eine Karte enthält ungültige Eingaben.')).toBeTruthy()
    expect(generateCardsPdf).not.toHaveBeenCalled()
  })

  it('Should generate valid cards', async () => {
    const generateCardsPdf = jest.fn()
    const generateCardsCsv = jest.fn()
    const cards = [initializeCard(bayernConfig.card, region, { fullName: 'Thea Test' })]
    const { getByText } = renderWithOptions(
      <CreateCardsButtonBar
        goBack={() => undefined}
        cards={cards}
        generateCardsPdf={generateCardsPdf}
        generateCardsCsv={generateCardsCsv}
      />,
      { translation: true, theme: true }
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.click(generateButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(generateCardsPdf).toHaveBeenCalled()
  })
})
