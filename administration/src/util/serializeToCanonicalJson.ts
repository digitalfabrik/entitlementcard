/**
 * Makes typescript aware of the presence of a property in an object and let it narrow down the type, so that we can
 * access the property.
 */
function hasProp<K extends PropertyKey>(data: object, prop: K): data is Record<K, unknown> {
  return prop in data
}

/**
 * Returns a serialization of the passed object according to RFC 8785 JSON Canonicalization Scheme (JCS).
 *
 * Taken & adjusted from https://github.com/erdtman/canonicalize/blob/master/lib/canonicalize.js
 * Under Apache 2.0 License
 *
 * Modifications:
 * 1) Throw, if a non JSON serializable object is passed to the function (instead of returning undefined).
 *    Especially, in the case of NaN or infinite number values.
 */
function serializeToCanonicalJson(object: unknown): string {
  if (object === undefined) {
    throw Error('Invalid argument undefined passed to serializeToCanonicalJson.')
  }
  if (object === null || ['string', 'boolean', 'bigint'].includes(typeof object)) {
    return JSON.stringify(object)
  }
  if (typeof object === 'number') {
    // Throw, if number is NaN or infinite.
    if (!isFinite(object)) {
      throw Error(`Number with value ${object} cannot be passed to serializeToCanonicalJson.`)
    }
    return JSON.stringify(object)
  }
  if (typeof object !== 'object') {
    throw Error(`Invalid argument of type ${typeof object} passed to serializeToCanonicalJson.`)
  }

  if (hasProp(object, 'toJSON') && object.toJSON instanceof Function) {
    return serializeToCanonicalJson(object.toJSON())
  }

  if (Array.isArray(object)) {
    const values = object.reduce((acc, value, index) => {
      const comma = index === 0 ? '' : ','
      return `${acc}${comma}${serializeToCanonicalJson(value)}`
    }, '')
    return `[${values}]`
  }

  const values = Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      const value = (object as Record<PropertyKey, unknown>)[key]
      const comma = acc.length === 0 ? '' : ','
      return `${acc}${comma}${serializeToCanonicalJson(key)}:${serializeToCanonicalJson(value)}`
    }, '')
  return `{${values}}`
}

export default serializeToCanonicalJson
