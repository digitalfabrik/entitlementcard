package app.ehrenamtskarte.backend.stores.importer

data class ImportPipeline<In, Out>(val filter: ImportFilter<In, Out>, val successor: ImportPipeline<Out, Any>) {

    val monitor = ImportMonitor()

    fun execute() = execute(emptyList(), monitor)

    fun execute(input: List<In>, monitor: ImportMonitor): List<Any> = successor.execute(filter.execute(input, monitor), monitor)

}

fun <Out>ImportPipeline(filter: ImportFilter<Unit, Out>, successor: ImportPipeline<Out, Any>) = ImportPipeline<Unit, Out>(filter, successor)
