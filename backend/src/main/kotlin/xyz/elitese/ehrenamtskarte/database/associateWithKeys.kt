package xyz.elitese.ehrenamtskarte.database


fun <TValue, TKey> Iterable<TValue>.associateWithKeys(keyFetcher: (TValue) -> TKey, keys: Iterable<TKey>): List<TValue?> {
    val objectsMap = this.associateBy { keyFetcher(it) }
    return keys.map { key -> objectsMap[key] }.asIterable().toList()
}
