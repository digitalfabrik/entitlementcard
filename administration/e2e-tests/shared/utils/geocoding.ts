import { type Page } from '@playwright/test'

/**
 * The store form validates addresses using an external geocoding service (nominatim).
 * Return fixed coordinates instead, so the tests do not depend on that service.
 */
export const mockGeocoding = async (page: Page): Promise<void> => {
  await page.route('https://nominatim.maps.tuerantuer.org/**', route =>
    route.fulfill({
      json: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [11.0767, 49.4521] },
            properties: {},
          },
        ],
      },
    }),
  )
}
