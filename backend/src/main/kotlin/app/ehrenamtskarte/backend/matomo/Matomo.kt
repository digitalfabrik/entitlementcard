package app.ehrenamtskarte.backend.matomo

import app.ehrenamtskarte.backend.config.MatomoConfig
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.stores.webservice.schema.SearchParams
import app.ehrenamtskarte.backend.verification.database.CodeType
import app.ehrenamtskarte.backend.verification.database.repos.CardRepository
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardGenerationModel
import jakarta.servlet.http.HttpServletRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.jetbrains.exposed.sql.transactions.transaction
import org.matomo.java.tracking.MatomoRequest
import org.matomo.java.tracking.MatomoRequest.MatomoRequestBuilder
import org.matomo.java.tracking.MatomoTracker
import org.matomo.java.tracking.TrackerConfiguration
import org.matomo.java.tracking.parameters.AcceptLanguage
import org.slf4j.LoggerFactory
import java.io.IOException
import java.net.URI
import java.util.concurrent.ExecutionException

object Matomo {
    val logger = LoggerFactory.getLogger(Matomo::class.java)

    private fun sendTrackingRequest(matomoConfig: MatomoConfig, requestBuilder: MatomoRequestBuilder) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val url = matomoConfig.url
            val tracker = MatomoTracker(TrackerConfiguration.builder().apiEndpoint(URI.create(url)).build())

            val matomoRequest = requestBuilder
                .siteId(siteId)
                .authToken(matomoConfig.accessToken)
                .build()

            try {
                // will log errors using it's own logger
                tracker.sendRequestAsync(matomoRequest)
            } catch (e: Exception) {
                when (e) {
                    is IOException -> logger.error("Could not send request to Matomo")
                    is ExecutionException, is InterruptedException ->
                        logger.error("Error while getting response", e)
                }
            }
        }
    }

    private fun sendBulkTrackingRequest(matomoConfig: MatomoConfig, requestBuilder: Iterable<MatomoRequestBuilder>) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val url = matomoConfig.url
            val tracker = MatomoTracker(TrackerConfiguration.builder().apiEndpoint(URI.create(url)).build())
            val matomoRequests = requestBuilder.map {
                it.siteId(siteId)
                it.authToken(matomoConfig.accessToken)
                it.build()
            }
            try {
                // will log errors using it's own logger
                tracker.sendBulkRequestAsync(matomoRequests)
            } catch (e: Exception) {
                when (e) {
                    is IOException -> logger.debug("Could not send request to Matomo")
                    is ExecutionException, is InterruptedException ->
                        logger.debug("Error while getting response")
                }
            }
        }
    }

    private fun attachRequestInformation(builder: MatomoRequestBuilder, request: HttpServletRequest): MatomoRequestBuilder {
        val userAgent = request.getHeader("User-Agent")
        val acceptLanguage = request.getHeader("Accept-Language")
        return builder
            .headerAcceptLanguage(AcceptLanguage.fromHeader(acceptLanguage))
            .headerUserAgent(userAgent)
            .visitorIp(request.remoteAddr)
    }

    private fun buildCardsTrackingRequest(request: HttpServletRequest, regionId: Int, query: String, codeType: CodeType, numberOfCards: Int): MatomoRequestBuilder {
        return MatomoRequest.request()
            .eventAction(query)
            .eventCategory(codeType.toString())
            .eventValue(numberOfCards.toDouble())
            .dimensions(mapOf(1L to regionId))
            .also { attachRequestInformation(it, request) }
    }

    fun trackCreateCards(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, cards: List<CardGenerationModel>) {
        if (projectConfig.matomo == null) return

        val staticCards = cards.filter { it.codeType === CodeType.STATIC }
        val dynamicCards = cards.filter { it.codeType === CodeType.DYNAMIC }
        if (staticCards.isNotEmpty() && dynamicCards.isNotEmpty()) {
            sendBulkTrackingRequest(
                projectConfig.matomo,
                listOf(
                    buildCardsTrackingRequest(request, staticCards.first().regionId, query, CodeType.STATIC, staticCards.count()),
                    buildCardsTrackingRequest(request, staticCards.first().regionId, query, CodeType.DYNAMIC, dynamicCards.count())
                )
            )
        } else if (staticCards.isNotEmpty()) {
            sendTrackingRequest(projectConfig.matomo, buildCardsTrackingRequest(request, staticCards.first().regionId, query, CodeType.STATIC, staticCards.count()))
        } else if (dynamicCards.isNotEmpty()) {
            sendTrackingRequest(
                projectConfig.matomo,
                buildCardsTrackingRequest(
                    request,
                    dynamicCards.first().regionId,
                    query,
                    CodeType.DYNAMIC,
                    dynamicCards.count()
                )
            )
        }
    }

    fun trackVerification(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, cardHash: ByteArray, codeType: CodeType, successful: Boolean) {
        if (projectConfig.matomo === null) return
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }
        sendTrackingRequest(
            projectConfig.matomo,
            MatomoRequest.request()
                .eventAction(query)
                .eventCategory(codeType.toString())
                .eventName(if (successful) "verification successful" else "verification failed")
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) }
        )
    }

    fun trackActivation(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, cardHash: ByteArray, successful: Boolean) {
        if (projectConfig.matomo === null) return
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }
        sendTrackingRequest(
            projectConfig.matomo,
            MatomoRequest.request()
                .eventAction(query)
                .eventValue(if (successful) 1.0 else 0.0)
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) }
        )
    }

    fun trackSearch(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, params: SearchParams, numResults: Int) {
        if (projectConfig.matomo === null) return
        if (params.searchText === null && params.categoryIds === null) return
        sendTrackingRequest(
            projectConfig.matomo,
            MatomoRequest.request()
                .actionName(query)
                .searchQuery((params.searchText ?: "") + "?categories=" + (params.categoryIds?.joinToString(",") ?: ""))
                .searchResultsCount(numResults.toLong())
                .also { attachRequestInformation(it, request) }
        )
    }
}
