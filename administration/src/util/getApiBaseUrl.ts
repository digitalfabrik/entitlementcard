const getApiBaseUrl = (): string =>
  // Take the VITE_BUILD_API_BASE_URL if defined (dev builds usually), otherwise use one of
  // the production URLs
  VITE_BUILD_API_BASE_URL ??
  (window.location.hostname.match(/staging./)
    ? 'https://api.staging.entitlementcard.app'
    : 'https://api.entitlementcard.app')

export default getApiBaseUrl
