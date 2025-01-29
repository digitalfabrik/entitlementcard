import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import AppStoreLinks from '../AppStoreLinks'

describe('AppStoreLinks', () => {
  const examplePlayStoreLink = 'https://play.google.com'
  const exampleAppStoreLink = 'https://apple.appstore.com'
  it('should provide correct store links', () => {
    const { getByText } = renderWithTranslation(
      <AppStoreLinks playStoreLink={examplePlayStoreLink} appStoreLink={exampleAppStoreLink} />
    )

    expect(getByText('AppStore öffnen').getAttribute('href')).toBe(exampleAppStoreLink)
    expect(getByText('Google Play öffnen').getAttribute('href')).toBe(examplePlayStoreLink)
  })
})
