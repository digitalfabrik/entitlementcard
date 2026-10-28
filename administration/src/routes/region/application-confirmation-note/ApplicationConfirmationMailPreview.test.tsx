import { waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { Client, Exchange, Operation, Provider as UrqlProvider, makeResult } from 'urql'
import { map, pipe, tap } from 'wonka'

import { renderWithOptions } from '../../../testing/render'
import ApplicationConfirmationMailPreview from './ApplicationConfirmationMailPreview'

const previewHtml = '<html><body><p>Sehr geehrte/r Erika Musterfrau,</p></body></html>'

describe('ApplicationConfirmationMailPreview', () => {
  let operations: Operation[] = []

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

  const renderPreview = (note: string, noteActivated: boolean) =>
    renderWithOptions(
      <ApplicationConfirmationMailPreview
        regionId={16}
        note={note}
        noteActivated={noteActivated}
      />,
      {
        wrapper,
        translation: true,
      },
    )

  beforeEach(() => {
    operations = []
  })

  it('should render the mail html', async () => {
    const { getByText } = renderPreview('Bitte warten.', true)

    await waitFor(() => expect(getByText('Sehr geehrte/r Erika Musterfrau,')).toBeTruthy())
  })

  it('should send the note and show that it is displayed if it is activated', async () => {
    const { getByText } = renderPreview('Bitte warten.', true)

    await waitFor(() =>
      expect(
        getByText(
          'Die Notiz ist aktiviert und wird angezeigt. Sie ist nur exemplarisch hervorgehoben.',
        ),
      ).toBeTruthy(),
    )
    expect(operations[0].variables).toEqual({
      regionId: 16,
      applicationConfirmationNote: 'Bitte warten.',
      applicationConfirmationNoteActivated: true,
    })
  })

  it('should send the deactivated note and show that it is not displayed', async () => {
    const { getByText } = renderPreview('Bitte warten.', false)

    await waitFor(() =>
      expect(
        getByText('Die Notiz ist nicht aktiviert oder leer und wird nicht angezeigt.'),
      ).toBeTruthy(),
    )
    expect(operations[0].variables).toEqual({
      regionId: 16,
      applicationConfirmationNote: 'Bitte warten.',
      applicationConfirmationNoteActivated: false,
    })
  })

  it('should show that a blank note is not displayed', async () => {
    const { getByText } = renderPreview('  ', true)

    await waitFor(() =>
      expect(
        getByText('Die Notiz ist nicht aktiviert oder leer und wird nicht angezeigt.'),
      ).toBeTruthy(),
    )
    expect(operations[0].variables).toEqual({
      regionId: 16,
      applicationConfirmationNote: '  ',
      applicationConfirmationNoteActivated: true,
    })
  })
})
