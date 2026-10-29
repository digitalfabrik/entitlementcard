import { describe, expect, it } from 'vitest'

import { renderWithOptions } from '../testing/render'
import AppStoreLinks from './AppStoreLinks'

describe('AppStoreLinks', () => {
  const examplePlayStoreLink = 'https://play.google.com'
  const exampleAppStoreLink = 'https://apple.appstore.com'
  it('should provide correct store links', () => {
    const { getByRole } = renderWithOptions(
      <AppStoreLinks playStoreLink={examplePlayStoreLink} appStoreLink={exampleAppStoreLink} />,
      { translation: true, theme: true },
    )

    expect(getByRole('link', { name: 'In App Store öffnen' })).toHaveAttribute(
      'href',
      exampleAppStoreLink,
    )
    expect(getByRole('link', { name: 'Bei Google Play öffnen' })).toHaveAttribute(
      'href',
      examplePlayStoreLink,
    )
  })
})
