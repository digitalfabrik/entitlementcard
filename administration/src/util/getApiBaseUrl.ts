const getApiBaseUrl = (): string =>
  window.location.hostname.match(/staging.$/)
    ? 'https://api.staging.entitlementcard.app'
    : (process.env.REACT_APP_API_BASE_URL as string)
export default getApiBaseUrl
