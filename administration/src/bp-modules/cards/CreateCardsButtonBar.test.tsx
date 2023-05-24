import { fireEvent, render } from '@testing-library/react'

import CardBlueprint from '../../cards/CardBlueprint'
import bayernConfig from '../../project-configs/bayern/config'
import CreateCardsButtonBar from './CreateCardsButtonBar'

describe('CreateCardsButtonBar', () => {
  it('Should goBack when clicking back', () => {
    const goBack = jest.fn()
    const { getByText } = render(
      <CreateCardsButtonBar goBack={goBack} cardBlueprints={[]} generateCards={() => Promise.resolve()} />
    )

    const backButton = getByText('Zurück zur Auswahl')
    expect(backButton).toBeTruthy()

    fireEvent.click(backButton)

    expect(goBack).toHaveBeenCalled()
  })

  it('Should disable generate button for no cards', () => {
    const generateCards = jest.fn()
    const { getByText, findByText } = render(
      <CreateCardsButtonBar goBack={() => {}} cardBlueprints={[]} generateCards={generateCards} />
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()
    expect(generateButton.disabled).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)

    expect(findByText('Legen Sie zunächst eine Karte an.')).toBeTruthy()
    expect(generateCards).not.toHaveBeenCalled()
  })

  it('Should disable generate button for invalid cards', () => {
    const generateCards = jest.fn()
    const cards = [new CardBlueprint('Thea Test', bayernConfig.card)]
    const { getByText, findByText } = render(
      <CreateCardsButtonBar goBack={() => {}} cardBlueprints={cards} generateCards={generateCards} />
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.mouseOver(generateButton)
    fireEvent.click(generateButton)

    expect(generateButton.disabled).toBeTruthy()
    expect(findByText('Mindestens eine Karte enthält ungültige Eingaben')).toBeTruthy()
    expect(generateCards).not.toHaveBeenCalled()
  })

  it('Should generate valid cards', () => {
    const generateCards = jest.fn()
    const region = {
      id: 0,
      name: 'augsburg',
      prefix: 'a',
      activatedForApplication: true,
    }
    const cards = [new CardBlueprint('Thea Test', bayernConfig.card, [region])]
    const { getByText } = render(
      <CreateCardsButtonBar goBack={() => {}} cardBlueprints={cards} generateCards={generateCards} />
    )

    const generateButton = getByText('QR-Codes drucken').closest('button') as HTMLButtonElement
    expect(generateButton).toBeTruthy()

    fireEvent.click(generateButton)

    expect(generateCards).toHaveBeenCalled()
  })
})
