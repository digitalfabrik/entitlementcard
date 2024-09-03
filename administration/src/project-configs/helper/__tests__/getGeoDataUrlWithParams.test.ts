import getGeoDataUrlWithParams, { GEO_SERVICE_URL } from '../getGeoDataUrlWithParams'

describe('getGeoDataWithParams', () => {
  it('should properly parse the href with url params', () => {
    const urlWithParams = getGeoDataUrlWithParams('Augsburg', 'Austraße', '27')
    expect(urlWithParams.href).toBe(
      `${GEO_SERVICE_URL}?format=geojson&addressdetails=1&countrycodes=de&city=Augsburg&street=27+Austra%C3%9Fe`
    )
  })

  it('should properly create proper search params', () => {
    const urlWithParams = getGeoDataUrlWithParams('Augsburg', 'Austraße', '27')
    expect(urlWithParams.search).toBe(
      `?format=geojson&addressdetails=1&countrycodes=de&city=Augsburg&street=27+Austra%C3%9Fe`
    )
  })
})
