package app.ehrenamtskarte.backend.stores.importer

import app.ehrenamtskarte.backend.config.BackendConfiguration
import org.slf4j.Logger

abstract class PipelineStep<In, Out> (protected val config: BackendConfiguration) {

    fun execute(input: In, logger: Logger): Out {
        val inputSize = if (input is List<*>) input.size else null
        val output = execute(input)
        val outputSize = if (output is List<*>) output.size else null

        if (inputSize != null && outputSize != null) {
            val filtered = inputSize - outputSize
            logger.info("$filtered of $inputSize where filtered out")
        }

        return output
    }

    abstract fun execute(input: In): Out

}

fun <In, Out> In.addStep(step: PipelineStep<In, Out>, logger: Logger, callback: () -> Unit): Out {
    callback()
    return step.execute( this, logger)
}
