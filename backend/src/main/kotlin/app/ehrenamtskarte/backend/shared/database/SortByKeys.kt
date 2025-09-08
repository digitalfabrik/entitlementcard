package app.ehrenamtskarte.backend.shared.database

/***
 * Extending an iterable of values (this).
 * Given a list of keys, we return `result`, a list of optional values.
 * The i-th element in `result` corresponds to the i-th element in `keys`.
 * If there was no value present with the i-th key, `result[i]` is null.
 * If there was exactly one value present with the i-th key, this value will be in `result[i]`.
 * Otherwise, if there are multiple values with the i-th key, then the method will throw.
 */
fun <TValue, TKey> Iterable<TValue>.sortByKeys(keySelector: (TValue) -> TKey, keys: Iterable<TKey>): List<TValue?> {
    val valuesByKey = groupBy(keySelector)
    return keys.map { valuesByKey[it]?.single() }
}
