const getMobileOperatingSystem = (): string => {
  const userAgent = navigator.userAgent || navigator.vendor
  if (/android/i.test(userAgent)) {
    return 'Android'
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'iOS'
  }
  return 'unknown'
}
export default getMobileOperatingSystem
