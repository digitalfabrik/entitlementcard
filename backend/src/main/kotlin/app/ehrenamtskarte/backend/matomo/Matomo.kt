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
import org.matomo.java.tracking.MatomoRequestBuilder
import org.matomo.java.tracking.MatomoTracker
import org.slf4j.LoggerFactory
import java.io.IOException
import java.util.concurrent.ExecutionException

object Matomo {
    val logger = LoggerFactory.getLogger(Matomo::class.java)

    private fun sendTrackingRequest(matomoConfig: MatomoConfig, requestBuilder: MatomoRequestBuilder) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val url = matomoConfig.url
            val tracker = MatomoTracker(url)

            val matomoRequest = requestBuilder
                .siteId(siteId)
                .authToken(matomoConfig.accessToken)
                .build()

            try {
                val response = tracker.sendRequestAsync(matomoRequest)
                val httpResponse = response.get()
                if (httpResponse.statusLine.statusCode > 399) {
                    logger.debug("Request failed with status code ${httpResponse.statusLine.statusCode}")
                }
            } catch (e: Exception) {
                when (e) {
                    is IOException -> logger.debug("Could not send request to Matomo")
                    is ExecutionException, is InterruptedException ->
                        logger.debug("Error while getting response")
                }
            }
        }
    }

    private fun sendBulkTrackingRequest(matomoConfig: MatomoConfig, requestBuilder: Iterable<MatomoRequestBuilder>) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val url = matomoConfig.url
            val tracker = MatomoTracker(url)
            val matomoRequests = requestBuilder.map {
                it.siteId(siteId)
                it.authToken(matomoConfig.accessToken)
                it.build()
            }
            try {
                val response = tracker.sendBulkRequestAsync(matomoRequests)
                val httpResponse = response.get()
                if (httpResponse.statusLine.statusCode > 399) {
                    logger.debug("Request failed with status code ${httpResponse.statusLine.statusCode}")
                }
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
            .headerAcceptLanguage(acceptLanguage)
            .headerUserAgent(userAgent)
            .visitorIp(request.remoteAddr)
    }

    private fun buildCardsTrackingRequest(request: HttpServletRequest, regionId: Int, query: String, codeType: CodeType, numberOfCards: Int): MatomoRequestBuilder {
        return MatomoRequest.builder()
            .eventAction(query)
            .eventCategory(codeType.toString())
            .eventValue(numberOfCards)
            .customTrackingParameters(mapOf("dimension1" to regionId))
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
            MatomoRequest.builder()
                .eventAction(query)
                .eventCategory(codeType.toString())
                .eventName(if (successful) "verification successful" else "verification failed")
                .customTrackingParameters(if (card != null) mapOf("dimension1" to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) }
        )
    }

    fun trackActivation(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, cardHash: ByteArray, successful: Boolean) {
        if (projectConfig.matomo === null) return
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }
        sendTrackingRequest(
            projectConfig.matomo,
            MatomoRequest.builder()
                .eventAction(query)
                .eventValue(if (successful) 1 else 0)
                .customTrackingParameters(if (card != null) mapOf("dimension1" to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) }
        )
    }

    fun trackSearch(projectConfig: ProjectConfig, request: HttpServletRequest, query: String, params: SearchParams, numResults: Int) {
        if (projectConfig.matomo === null) return
        if (params.searchText === null && params.categoryIds === null) return
        sendTrackingRequest(
            projectConfig.matomo,
            MatomoRequest.builder()
                .actionName(query)
                .searchQuery((params.searchText ?: "") + "?categories=" + (params.categoryIds?.joinToString(",") ?: ""))
                .searchResultsCount(numResults.toLong())
                .also { attachRequestInformation(it, request) }
        )
    }
}
