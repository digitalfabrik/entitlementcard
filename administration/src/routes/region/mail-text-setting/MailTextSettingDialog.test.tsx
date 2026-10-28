import { fireEvent, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { Client, Exchange, Operation, Provider as UrqlProvider, makeResult } from 'urql'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { map, pipe, tap } from 'wonka'

import { GetContactInformationMailPreviewDocument, GraphQlExceptionCode } from '../../../graphql'
import { renderWithOptions } from '../../../testing/render'
import MailTextPreview from './MailTextPreview'
import MailTextSettingDialog from './MailTextSettingDialog'

const previewHtml = '<html><body><p>Sehr geehrte/r Erika Musterfrau,</p></body></html>'

const texts = {
  headline: 'Kontaktinformationen',
  explanation: 'Erklärung',
  dialogTitle: 'Kontaktinformationen E-Mail',
  dialogDescription: 'Geben Sie ausschließlich die Kontaktdaten ein.',
  placeholder: 'Kontaktdaten...',
  activatedLabel: 'Kontaktinformationen aktivieren',
}

describe('MailTextSettingDialog', () => {
  let operations: Operation[] = []
  const onSave = vi.fn()

  const mockExchange: Exchange = () => ops$ =>
    pipe(
      ops$,
      tap(op => operations.push(op)),
      map(op => makeResult(op, { data: { preview: previewHtml } })),
    )

  const wrapper = ({ children }: { children: ReactNode }) => (
    <UrqlProvider value={new Client({ url: '/graphql', exchanges: [mockExchange] })}>
      {children}
    </UrqlProvider>
  )

  const renderDialog = (defaultText: string, defaultActivated: boolean) =>
    renderWithOptions(
      <MailTextSettingDialog
        texts={texts}
        maxChars={500}
        maxCharsErrorCode={GraphQlExceptionCode.InvalidContactInformationSize}
        defaultText={defaultText}
        defaultActivated={defaultActivated}
        isSaving={false}
        onSave={onSave}
        onClose={vi.fn()}
        renderPreview={(text, activated) => (
          <MailTextPreview
            query={GetContactInformationMailPreviewDocument}
            variables={{
              regionId: 16,
              contactInformation: text,
              contactInformationActivated: activated,
            }}
            text={text}
            activated={activated}
            textShownStatus='Wird angezeigt'
            textHiddenStatus='Wird nicht angezeigt'
          />
        )}
      />,
      { wrapper, translation: true },
    )

  beforeEach(() => {
    operations = []
    onSave.mockReset()
  })

  it('should show the description and save the text with the activation', () => {
    const { getByText, getByDisplayValue, getByLabelText } = renderDialog('Büro', false)

    expect(getByText('Geben Sie ausschließlich die Kontaktdaten ein.')).toBeTruthy()
    fireEvent.change(getByDisplayValue('Büro'), { target: { value: 'Neues Büro' } })
    fireEvent.click(getByLabelText('Kontaktinformationen aktivieren'))
    fireEvent.click(getByText('Speichern'))

    expect(onSave).toHaveBeenCalledWith('Neues Büro', true)
  })

  it('should show the error message of the given error code if the text is too long', () => {
    const { getByText, getByDisplayValue } = renderDialog('Büro', true)

    fireEvent.change(getByDisplayValue('Büro'), { target: { value: 'a'.repeat(501) } })

    expect(
      getByText(
        'Unzulässige Zeichenlänge der Kontaktinformationen erreicht. Maximal sind 500 Zeichen erlaubt.',
      ),
    ).toBeTruthy()
  })

  it('should request the preview with the current text and show that it is displayed', async () => {
    const { getByText, getByRole } = renderDialog('Büro', true)

    fireEvent.click(getByRole('tab', { name: 'E-Mail-Vorschau' }))

    await waitFor(() => expect(getByText('Sehr geehrte/r Erika Musterfrau,')).toBeTruthy())
    expect(getByText('Wird angezeigt')).toBeTruthy()
    expect(operations[0].variables).toEqual({
      regionId: 16,
      contactInformation: 'Büro',
      contactInformationActivated: true,
    })
  })

  it('should show that a deactivated text is not displayed', async () => {
    const { getByText, getByRole } = renderDialog('Büro', false)

    fireEvent.click(getByRole('tab', { name: 'E-Mail-Vorschau' }))

    await waitFor(() => expect(getByText('Wird nicht angezeigt')).toBeTruthy())
    expect(operations[0].variables).toEqual({
      regionId: 16,
      contactInformation: 'Büro',
      contactInformationActivated: false,
    })
  })

  it('should show that a blank text is not displayed', async () => {
    const { getByText, getByRole } = renderDialog('  ', true)

    fireEvent.click(getByRole('tab', { name: 'E-Mail-Vorschau' }))

    await waitFor(() => expect(getByText('Wird nicht angezeigt')).toBeTruthy())
  })
})
