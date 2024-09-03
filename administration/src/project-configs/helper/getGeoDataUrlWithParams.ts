export const GEO_SERVICE_URL = 'https://nominatim.maps.tuerantuer.org/nominatim/search'
const getGeoDataUrlWithParams = (location: string, street: string, houseNr: string): URL => {
  const geoServiceUrl = new URL(GEO_SERVICE_URL)
  geoServiceUrl.searchParams.append('format', 'geojson')
  geoServiceUrl.searchParams.append('addressdetails', '1')
  geoServiceUrl.searchParams.append('countrycodes', 'de')
  geoServiceUrl.searchParams.append('city', location)
  geoServiceUrl.searchParams.append('street', `${houseNr} ${street}`)
  return geoServiceUrl
}

export default getGeoDataUrlWithParams
