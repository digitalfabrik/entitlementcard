package app.ehrenamtskarte.backend.application.webservice.utils

fun <K, V> onlySelectedIsPresent(
    mapping: Map<K, V?>,
    selectedKey: K,
) = selectedKey in mapping &&
    mapping.all {
        if (it.key == selectedKey) it.value != null else it.value == null
    }
