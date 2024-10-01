import { FeatureCollection, GeoJSON, Point } from 'geojson'

import { AcceptingStoreEntry } from '../AcceptingStoreEntry'
import { LONG_ERROR_TIMEOUT } from '../StoresCSVInput'

const GEO_SERVICE_URL = 'https://nominatim.maps.tuerantuer.org/nominatim/search'

const isStoreMissingLocationInformation = (store: AcceptingStoreEntry): boolean =>
  store.data.location.length === 0 || store.data.street.length === 0 || store.data.houseNumber.length === 0

const handleStoreWithMissingLocationInformation = (
  store: AcceptingStoreEntry,
  storeIndex: number,
  showInputError: (message: string, timeout?: number) => void
): AcceptingStoreEntry => {
  showInputError(
    `Eintrag ${
      storeIndex + 1
    }: Es sind nicht alle notwendigen Adressdaten vorhanden, um die notwendigen Geodaten abzurufen`,
    LONG_ERROR_TIMEOUT
  )
  return store
}
const getGeoDataUrlWithParams = (location: string, street: string, houseNr: string): URL => {
  const geoServiceUrl = new URL(GEO_SERVICE_URL)
  geoServiceUrl.searchParams.append('format', 'geojson')
  geoServiceUrl.searchParams.append('countrycodes', 'de')
  geoServiceUrl.searchParams.append('city', location)
  geoServiceUrl.searchParams.append('street', `${houseNr} ${street}`)
  return geoServiceUrl
}

const getStoreCoordinatesFromGeoDataService = (
  store: AcceptingStoreEntry,
  storeIndex: number,
  showInputError: (message: string, timeout?: number) => void
): Promise<AcceptingStoreEntry> =>
  fetch(getGeoDataUrlWithParams(store.data.location, store.data.street, store.data.houseNumber).href)
    .then(response => response.json())
    .then(({ features }: FeatureCollection<Point, GeoJSON>) => {
      if (features.length === 0) {
        showInputError(
          `Eintrag ${storeIndex + 1}: Keine passenden Geodaten gefunden! Bitte prüfen sie die Adresse.`,
          LONG_ERROR_TIMEOUT
        )
        return store
      }
      const feature = features[0]
      const updatedStore = store
      updatedStore.data.longitude = feature.geometry.coordinates[0].toString()
      updatedStore.data.latitude = feature.geometry.coordinates[1].toString()
      return updatedStore
    })

export const getStoresWithCoordinates = (
  stores: AcceptingStoreEntry[],
  showInputError: (message: string, timeout?: number) => void
): Promise<AcceptingStoreEntry>[] =>
  stores.map((store, index) => {
    if (store.hasValidCoordinates()) {
      return Promise.resolve(store)
    }
    if (isStoreMissingLocationInformation(store)) {
      return Promise.resolve(handleStoreWithMissingLocationInformation(store, index, showInputError))
    }
    return getStoreCoordinatesFromGeoDataService(store, index, showInputError)
  })
