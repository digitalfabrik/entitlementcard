const getApiBaseUrl = (): string =>
  window.location.hostname.match(/staging./) ? 'https://api.staging.entitlementcard.app' : VITE_BUILD_API_BASE_URL

export default getApiBaseUrl
