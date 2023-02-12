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
 * 1) Throw, if undefined is passed to the function (instead of returning undefined).
 * 2) Throw, if an item of an array is undefined or if it is a Symbol (instead of serializing null).
 * 3) Throw, if the value of an object is undefined or if it is a Symbol (instead of skipping the entry).
 */
function serializeToCanonicalJson(object: unknown): string {
  if (typeof object === 'undefined') {
    throw Error('Invalid argument undefined passed to serializeToCanonicalJson')
  }
  if (object === null || typeof object !== 'object') {
    return JSON.stringify(object)
  }

  if (hasProp(object, 'toJSON') && object.toJSON instanceof Function) {
    return serializeToCanonicalJson(object.toJSON())
  }

  if (Array.isArray(object)) {
    const values = object.reduce((acc, value, index) => {
      const comma = index === 0 ? '' : ','
      if (value === undefined || typeof value === 'symbol') {
        throw Error(`Cannot serialize value ${String(value)}.`)
      }
      return `${acc}${comma}${serializeToCanonicalJson(value)}`
    }, '')
    return `[${values}]`
  }

  const values = Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      const value = (object as Record<PropertyKey, unknown>)[key]
      if (value === undefined || typeof value === 'symbol') {
        throw Error(`Cannot serialize value ${String(value)}.`)
      }
      const comma = acc.length === 0 ? '' : ','
      return `${acc}${comma}${serializeToCanonicalJson(key)}:${serializeToCanonicalJson(value)}`
    }, '')
  return `{${values}}`
}

export default serializeToCanonicalJson
