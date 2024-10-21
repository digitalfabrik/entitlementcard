// This file originally stems from a CRA-eject.
import { createHash } from 'crypto'

const createEnvironmentHash = (env: object): string => {
  const hash = createHash('md5')
  hash.update(JSON.stringify(env))

  return hash.digest('hex')
}

export default createEnvironmentHash
