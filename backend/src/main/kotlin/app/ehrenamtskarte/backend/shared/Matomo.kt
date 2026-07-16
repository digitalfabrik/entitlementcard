package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.config.BackendConfiguration
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
import org.springframework.stereotype.Service
import java.net.URI

enum class MatomoEventCategory(val value: String) {
    ACTIVATION("activation"),
    DYNAMIC(CodeType.DYNAMIC.name),
    STATIC(CodeType.STATIC.name),
}

enum class MatomoEventName(val value: String) {
    ACTIVATION_FAILED("activation failed"),
    ACTIVATION_SUCCESSFUL("activation successful"),
    CARD_CREATION_SUCCESSFUL("card creation successful"),
    VERIFICATION_FAILED("verification failed"),
    VERIFICATION_SUCCESSFUL("verification successful"),
}

@Service
class Matomo(
    config: BackendConfiguration,
) {
    private val logger = LoggerFactory.getLogger(Matomo::class.java)
    private var tracker: MatomoTracker = MatomoTracker(
        TrackerConfiguration.builder().apiEndpoint(URI.create(config.matomoUrl)).build(),
    )

    private fun sendTrackingRequest(projectConfig: ProjectConfig, requestBuilder: MatomoRequest.MatomoRequestBuilder) {
        CoroutineScope(Dispatchers.IO).launch {
            projectConfig.matomo?.let { matomoConfig ->
                val matomoRequest = requestBuilder
                    .siteId(matomoConfig.siteId)
                    .authToken(matomoConfig.accessToken)
                    .build()

                try {
                    tracker.sendRequestAsync(matomoRequest)
                } catch (e: Exception) {
                    when (e) {
                        is IOException -> {
                            logger.error("Could not send request to Matomo")
                        }

                        is ExecutionException, is InterruptedException -> {
                            logger.error("Error while getting response", e)
                        }
                    }
                }
            }
        }
    }

    private fun sendBulkTrackingRequest(
        projectConfig: ProjectConfig,
        requestBuilder: Iterable<MatomoRequest.MatomoRequestBuilder>,
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            projectConfig.matomo?.let { matomoConfig ->
                val siteId = matomoConfig.siteId
                val matomoRequests = requestBuilder.map {
                    it.siteId(siteId)
                    it.authToken(matomoConfig.accessToken)
                    it.build()
                }
                try {
                    tracker.sendBulkRequestAsync(matomoRequests)
                } catch (e: Exception) {
                    when (e) {
                        is IOException -> {
                            logger.debug("Could not send request to Matomo")
                        }

                        is ExecutionException, is InterruptedException -> {
                            logger.debug("Error while getting response")
                        }
                    }
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
            .eventCategory(MatomoEventCategory.valueOf(codeType.name).value)
            .eventName(MatomoEventName.CARD_CREATION_SUCCESSFUL.value)
            .eventValue(numberOfCards.toDouble())
            .dimensions(mapOf(1L to regionId))
            .also { attachRequestInformation(it, request) }

    fun trackCreateCards(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        regionId: Int,
        numberOfDynamicCards: Int,
        numberOfStaticCards: Int,
    ) {
        if (numberOfDynamicCards > 0 && numberOfStaticCards > 0) {
            sendBulkTrackingRequest(
                projectConfig = projectConfig,
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
                projectConfig = projectConfig,
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
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardHash: ByteArray,
        codeType: CodeType,
        successful: Boolean,
    ) {
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }

        sendTrackingRequest(
            projectConfig = projectConfig,
            MatomoRequest.request()
                .eventAction(query)
                .eventCategory(MatomoEventCategory.valueOf(codeType.name).value)
                .eventName(
                    if (successful) {
                        MatomoEventName.VERIFICATION_SUCCESSFUL.value
                    } else {
                        MatomoEventName.VERIFICATION_FAILED.value
                    },
                )
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) },
        )
    }

    fun trackActivation(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardHash: ByteArray,
        successful: Boolean,
    ) {
        val card = transaction { CardRepository.findByHash(projectConfig.id, cardHash) }

        sendTrackingRequest(
            projectConfig = projectConfig,
            MatomoRequest.request()
                .eventAction(query)
                .eventCategory(MatomoEventCategory.ACTIVATION.value)
                .eventName(
                    if (successful) {
                        MatomoEventName.ACTIVATION_SUCCESSFUL.value
                    } else {
                        MatomoEventName.ACTIVATION_FAILED.value
                    },
                )
                .eventValue(if (successful) 1.0 else 0.0)
                .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap())
                .also { attachRequestInformation(it, request) },
        )
    }

    fun trackSearch(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        params: SearchParams,
        numResults: Int,
    ) {
        if (params.searchText === null && params.categoryIds === null) return

        sendTrackingRequest(
            projectConfig = projectConfig,
            MatomoRequest.request()
                .actionName(query)
                .searchCategory(params.categoryIds?.joinToString(","))
                .searchQuery(params.searchText ?: "")
                .searchResultsCount(numResults.toLong())
                .also { attachRequestInformation(it, request) },
        )
    }
}
