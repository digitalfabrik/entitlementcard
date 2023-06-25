import { createHash } from 'crypto'

export default function (env: object) {
  const hash = createHash('md5')
  hash.update(JSON.stringify(env))

  return hash.digest('hex')
}
