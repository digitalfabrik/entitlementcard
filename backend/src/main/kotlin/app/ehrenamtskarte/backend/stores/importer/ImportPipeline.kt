package app.ehrenamtskarte.backend.stores.importer

interface PipelineStep<In, Out> {

    fun execute(input: In): Out

}

fun <In, Out> In.addStep(step: PipelineStep<In, Out>, message: String): Out {
    println(message)
    return step.execute( this)
}
