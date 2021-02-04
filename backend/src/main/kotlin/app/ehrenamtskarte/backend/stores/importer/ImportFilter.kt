package app.ehrenamtskarte.backend.stores.importer

interface ImportFilter<In, Out> {

    fun execute(input: List<In>, monitor: ImportMonitor): List<Out>

}
