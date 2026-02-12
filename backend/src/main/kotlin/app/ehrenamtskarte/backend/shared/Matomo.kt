package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.MatomoConfig
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.db.repositories.CardRepository
import app.ehrenamtskarte.backend.graphql.stores.types.SearchParams
import jakarta.servlet.http.HttpServletRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.matomo.java.tracking.MatomoRequest
import org.matomo.java.tracking.MatomoTracker
import org.matomo.java.tracking.TrackerConfiguration
import org.matomo.java.tracking.parameters.AcceptLanguage
import org.slf4j.LoggerFactory
import java.io.IOException
import java.net.URI
import java.util.concurrent.ExecutionException

object Matomo {
    private val logger = LoggerFactory.getLogger(Matomo::class.java)
    private var tracker: MatomoTracker? = null

    private fun getTracker(config: BackendConfiguration): MatomoTracker {
        val tracker = tracker
        if (tracker == null) {
            val newTracker = MatomoTracker(
                TrackerConfiguration.builder().apiEndpoint(URI.create(config.matomoUrl)).build(),
            )
            Matomo.tracker = newTracker
            return newTracker
        }

        return tracker
    }

    private fun sendTrackingRequest(
        config: BackendConfiguration,
        matomoConfig: MatomoConfig,
        requestBuilder: MatomoRequest.MatomoRequestBuilder,
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val tracker = getTracker(config)

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

    private fun sendBulkTrackingRequest(
        config: BackendConfiguration,
        matomoConfig: MatomoConfig,
        requestBuilder: Iterable<MatomoRequest.MatomoRequestBuilder>,
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            val siteId = matomoConfig.siteId
            val tracker = getTracker(config)
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

    private fun attachRequestInformation(
        builder: MatomoRequest.MatomoRequestBuilder,
        request: HttpServletRequest,
    ): MatomoRequest.MatomoRequestBuilder {
        val userAgent = request.getHeader("User-Agent")
        val acceptLanguage = request.getHeader("Accept-Language")
        return builder
            .headerAcceptLanguage(AcceptLanguage.fromHeader(acceptLanguage))
            .headerUserAgent(userAgent)
            .visitorIp(request.remoteAddr)
    }

    private fun buildCardsTrackingRequest(
        request: HttpServletRequest,
        regionId: Int,
        query: String,
        codeType: CodeType,
        numberOfCards: Int,
    ): MatomoRequest.MatomoRequestBuilder =
        MatomoRequest.request()
            .eventAction(query)
            .eventCategory(codeType.toString())
            .eventValue(numberOfCards.toDouble())
            .dimensions(mapOf(1L to regionId))
            .also { attachRequestInformation(it, request) }

    fun trackCreateCards(
        config: BackendConfiguration,
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        regionId: Int,
        numberOfDynamicCards: Int,
        numberOfStaticCards: Int,
    ) {
        if (projectConfig.matomo == null) return

        if (numberOfDynamicCards > 0 && numberOfStaticCards > 0) {
            sendBulkTrackingRequest(
                config,
                projectConfig.matomo,
                listOf(
                    buildCardsTrackingRequest(
                        request,
                        regionId,
                        query,
                        CodeType.STATIC,
                        numberOfStaticCards,
                    ),
                    buildCardsTrackingRequest(
                        request,
                        regionId,
                        query,
                        CodeType.DYNAMIC,
                        numberOfDynamicCards,
                    ),
                ),
            )
        } else if (numberOfDynamicCards > 0) {
            sendTrackingRequest(
                config,
                projectConfig.matomo,
                buildCardsTrackingRequest(
                    request,
                    regionId,
                    query,
                    CodeType.DYNAMIC,
                    numberOfDynamicCards,
                ),
            )
        }
    }

    fun trackVerification(
        config: BackendConfiguration,
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardHash: ByteArray,
        codeType: CodeType,
        successful: Boolean,
    ) {
        if (projectConfig.matomo === null) return
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }
        sendTrackingRequest(
            config,
            projectConfig.matomo,
            MatomoRequest.request()
                .eventAction(query)
                .eventCategory(codeType.toString())
                .eventName(if (successful) "verification successful" else "verification failed")
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) },
        )
    }

    fun trackActivation(
        config: BackendConfiguration,
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardHash: ByteArray,
        successful: Boolean,
    ) {
        if (projectConfig.matomo === null) return
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }
        sendTrackingRequest(
            config,
            projectConfig.matomo,
            MatomoRequest.request()
                .eventAction(query)
                .eventValue(if (successful) 1.0 else 0.0)
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) },
        )
    }

    fun trackSearch(
        config: BackendConfiguration,
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        params: SearchParams,
        numResults: Int,
    ) {
        if (projectConfig.matomo === null) return
        if (params.searchText === null && params.categoryIds === null) return
        sendTrackingRequest(
            config,
            projectConfig.matomo,
            MatomoRequest.request()
                .actionName(query)
                .searchCategory(params.categoryIds?.joinToString(","))
                .searchQuery(params.searchText ?: "")
                .searchResultsCount(numResults.toLong())
                .also { attachRequestInformation(it, request) },
        )
    }
}
