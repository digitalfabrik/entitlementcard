export const isDevMode = (): boolean => window.location.hostname === 'localhost'
export const isStagingMode = (): boolean => !!window.location.hostname.match(/staging./)
