package app.ehrenamtskarte.backend.common.database


fun <TValue: Any, TKey> Iterable<TValue>.sortByKeys(keyFetcher: (TValue) -> TKey, keys: Iterable<TKey>): List<TValue> {
    val objectsMap = this.associateBy { keyFetcher(it) }
    return keys.map { objectsMap[it] }.asIterable().toList().filterNotNull()
}
