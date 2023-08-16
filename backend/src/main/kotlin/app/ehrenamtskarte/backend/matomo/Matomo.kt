package app.ehrenamtskarte.backend.matomo

import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import app.ehrenamtskarte.backend.verification.database.CodeType
import org.matomo.java.tracking.MatomoRequest
import org.matomo.java.tracking.MatomoTracker
import org.matomo.java.tracking.MatomoRequestBuilder
import java.io.IOException
import java.io.UncheckedIOException
import java.util.concurrent.ExecutionException

object Matomo {
    private fun sendTrackingRequest(projectConfig: ProjectConfig, requestBuilder: MatomoRequestBuilder) {
        if (projectConfig.matomo === null) {
            return
        }
        val siteId = projectConfig.matomo.siteId
        val url = projectConfig.matomo.url
        val tracker = MatomoTracker(url)
        requestBuilder.siteId(siteId)
        try {
            tracker.sendRequestAsync(requestBuilder.build())
        } catch (e: Exception) {
            when (e) {
                is IOException -> throw UncheckedIOException("Could not send request to Matomo", e)
                is ExecutionException, is InterruptedException ->
                    throw RuntimeException("Error while getting response", e)
            }
        }
    }

    fun trackCreateCards(projectConfig: ProjectConfig, cards: List<CardGenerationModel>) {
        this.sendTrackingRequest(projectConfig, MatomoRequest.builder()
        .actionName("createCards"))
    }

    fun trackVerification(projectConfig: ProjectConfig, region: String, codeType: CodeType, successful: Boolean) {
        this.sendTrackingRequest(projectConfig, MatomoRequest.builder()
        .actionName("verifyCard")
        .customTrackingParameters(mapOf("region" to region, "codeType" to codeType, "successful" to successful)))
    }

    fun trackActivation(projectConfig: ProjectConfig, region: String) {
        this.sendTrackingRequest(projectConfig, MatomoRequest.builder()
        .actionName("activateCard")
        .customTrackingParameters(mapOf("region" to region)))
    }
}
