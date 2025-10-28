import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import AppStoreLinks from '../AppStoreLinks'

describe('AppStoreLinks', () => {
  const examplePlayStoreLink = 'https://play.google.com'
  const exampleAppStoreLink = 'https://apple.appstore.com'
  it('should provide correct store links', () => {
    const { getByRole } = renderWithTranslation(
      <AppStoreLinks playStoreLink={examplePlayStoreLink} appStoreLink={exampleAppStoreLink} />
    )

    expect(getByRole('link', { name: 'AppStore öffnen' })).toHaveAttribute('href', exampleAppStoreLink)
    expect(getByRole('link', { name: 'Google Play öffnen' })).toHaveAttribute('href', examplePlayStoreLink)
  })
})
