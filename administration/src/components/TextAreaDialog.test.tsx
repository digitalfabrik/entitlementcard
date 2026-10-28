import { act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithOptions } from '../testing/render'
import TextAreaDialog from './TextAreaDialog'

describe('TextAreaDialog', () => {
  const onClose = vi.fn()
  const onSave = vi.fn()
  const defaultText = 'Hallo'
  const placeholderText = 'Hier kann ein Text stehen...'
  const renderTextDialog = ({
    maxChars,
    defaultText,
  }: {
    maxChars?: number
    defaultText: string | null
  }) =>
    renderWithOptions(
      <TextAreaDialog
        title='Show note'
        loading={false}
        maxChars={maxChars}
        defaultText={defaultText}
        placeholder={placeholderText}
        isOpen
        onClose={onClose}
        onSave={onSave}
      />,
      { translation: true },
    )

  it('should disable save button when character limit is exceeded', async () => {
    const { getByText, getByDisplayValue } = renderTextDialog({ maxChars: 10, defaultText })
    const input = getByDisplayValue(defaultText)
    fireEvent.change(input, { target: { value: 'Das ist ein zu langer Text' } })
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    const saveButton = getByText('Speichern').closest('button')
    expect(saveButton?.hasAttribute('disabled')).toBeTruthy()
  })

  it('should display the character counter if max characters were provided', () => {
    const { getByLabelText } = renderTextDialog({ maxChars: 10, defaultText })
    const characterCounter = getByLabelText('Character Counter')
    expect(characterCounter).toBeDefined()
  })

  it('should not display the character counter if max characters were provided', () => {
    const { queryByLabelText } = renderTextDialog({ defaultText })
    expect(queryByLabelText('Character Counter')).toBeNull()
  })

  it('should call onSave if character count was not exceeded and button was clicked', async () => {
    const { getByText, getByDisplayValue } = renderTextDialog({ maxChars: 15, defaultText })
    const input = getByDisplayValue(defaultText)
    fireEvent.change(input, { target: { value: 'Das ist kurz' } })
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    const saveButton = getByText('Speichern').closest('button')
    expect(saveButton?.hasAttribute('disabled')).toBeFalsy()
    fireEvent.click(getByText('Speichern'))
    expect(onSave).toHaveBeenCalled()
  })

  it('should call onClose if character count was not exceeded', async () => {
    const { getByText } = renderTextDialog({ maxChars: 10, defaultText })
    fireEvent.click(getByText('Schließen'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should show placeholder text if no default text was provided', async () => {
    const { getByPlaceholderText } = renderTextDialog({ maxChars: 10, defaultText: null })
    expect(getByPlaceholderText(placeholderText)).toBeTruthy()
  })

  it('should not show tabs if no preview was provided', () => {
    const { queryByRole, queryByLabelText } = renderTextDialog({ defaultText })
    expect(queryByRole('tab')).toBeNull()
    expect(queryByLabelText('Schließen')).toBeNull()
  })

  it('should render the preview of the current text in the preview tab', () => {
    const { getByText, getByDisplayValue, getByRole, getByLabelText, queryByText } =
      renderWithOptions(
        <TextAreaDialog
          title='Show note'
          loading={false}
          defaultText={defaultText}
          placeholder={placeholderText}
          isOpen
          onClose={onClose}
          onSave={onSave}
          preview={{ label: 'Vorschau', render: text => <span>Vorschau von {text}</span> }}
        />,
        { translation: true },
      )
    fireEvent.change(getByDisplayValue(defaultText), { target: { value: 'Neuer Text' } })
    fireEvent.click(getByRole('tab', { name: 'Vorschau' }))

    expect(getByText('Vorschau von Neuer Text')).toBeTruthy()

    fireEvent.click(getByRole('tab', { name: 'Bearbeiten' }))
    expect(queryByText('Vorschau von Neuer Text')).toBeNull()
    expect(getByDisplayValue('Neuer Text')).toBeTruthy()

    // The close icon is labeled, the cancel button only has a text
    fireEvent.click(getByLabelText('Schließen'))
    expect(onClose).toHaveBeenCalled()
  })
})
