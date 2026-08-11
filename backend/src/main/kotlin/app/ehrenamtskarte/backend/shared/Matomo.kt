package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.MatomoConfig
import app.ehrenamtskarte.backend.config.ProjectConfig
import app.ehrenamtskarte.backend.db.entities.CardEntity
import app.ehrenamtskarte.backend.db.entities.CodeType
import app.ehrenamtskarte.backend.graphql.cards.types.ActivationState
import app.ehrenamtskarte.backend.graphql.stores.types.SearchParams
import jakarta.servlet.http.HttpServletRequest
import org.matomo.java.tracking.MatomoException
import org.matomo.java.tracking.MatomoRequest
import org.matomo.java.tracking.MatomoTracker
import org.matomo.java.tracking.TrackerConfiguration
import org.matomo.java.tracking.parameters.AcceptLanguage
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.net.URI

enum class MatomoEventCategory(val value: String) {
    ACTIVATION("activation"),
    DYNAMIC("DYNAMIC"),
    STATIC("STATIC"),
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

    fun trackCreateCards(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        regionId: Int,
        numberOfDynamicCards: Int,
        numberOfStaticCards: Int,
    ) {
        projectConfig.matomo?.let { matomoConfig ->
            sendTrackingRequests(
                listOfNotNull(
                    if (numberOfStaticCards > 0) {
                        createEventRequest(
                            matomoConfig = matomoConfig,
                            httpRequest = request,
                            eventAction = query,
                            eventCategory = MatomoEventCategory.STATIC,
                            eventName = MatomoEventName.CARD_CREATION_SUCCESSFUL,
                            eventValue = numberOfStaticCards.toDouble(),
                            dimensions = mapOf(1L to regionId),
                        )
                    } else {
                        null
                    },
                    if (numberOfDynamicCards > 0) {
                        createEventRequest(
                            matomoConfig = matomoConfig,
                            httpRequest = request,
                            eventAction = query,
                            eventCategory = MatomoEventCategory.DYNAMIC,
                            eventName = MatomoEventName.CARD_CREATION_SUCCESSFUL,
                            eventValue = numberOfDynamicCards.toDouble(),
                            dimensions = mapOf(1L to regionId),
                        )
                    } else {
                        null
                    },
                ),
            )
        }
    }

    fun trackVerification(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        card: CardEntity?,
        codeType: CodeType,
        successful: Boolean,
    ) {
        projectConfig.matomo?.let { matomoConfig ->
            sendTrackingRequest(
                createEventRequest(
                    matomoConfig = matomoConfig,
                    httpRequest = request,
                    eventAction = query,
                    eventCategory = when (codeType) {
                        CodeType.DYNAMIC -> MatomoEventCategory.DYNAMIC
                        CodeType.STATIC -> MatomoEventCategory.STATIC
                    },
                    eventName = if (successful) {
                        MatomoEventName.VERIFICATION_SUCCESSFUL
                    } else {
                        MatomoEventName.VERIFICATION_FAILED
                    },
                    eventValue = null,
                    dimensions = if (card != null) mapOf(1L to card.regionId) else emptyMap(),
                ),
            )
        }
    }

    fun trackActivation(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardEntity: CardEntity?,
        cardActivationState: ActivationState,
    ) {
        projectConfig.matomo?.let { matomoConfig ->
            sendTrackingRequest(
                createEventRequest(
                    matomoConfig = matomoConfig,
                    httpRequest = request,
                    eventAction = query,
                    eventCategory = MatomoEventCategory.ACTIVATION,
                    eventName = if (cardActivationState == ActivationState.success) {
                        MatomoEventName.ACTIVATION_SUCCESSFUL
                    } else {
                        MatomoEventName.ACTIVATION_FAILED
                    },
                    eventValue = if (cardActivationState == ActivationState.success) 1.0 else 0.0,
                    dimensions = if (cardEntity != null) mapOf(1L to cardEntity.regionId) else emptyMap(),
                ),
            )
        }
    }

    fun trackSearch(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        params: SearchParams,
        numResults: Int,
    ) {
        if (params.searchText != null || params.categoryIds != null) {
            projectConfig.matomo?.let { matomoConfig ->
                sendTrackingRequest(
                    createSearchRequest(
                        matomoConfig = matomoConfig,
                        httpRequest = request,
                        eventAction = query,
                        searchCategories = params.categoryIds,
                        searchText = params.searchText,
                        searchResultCount = numResults,
                    ),
                )
            }
        }
    }

    private fun sendTrackingRequest(matomoRequest: MatomoRequest) {
        try {
            tracker.sendRequestAsync(matomoRequest).exceptionally(::logMatomoErrors)
        } catch (e: Throwable) {
            logger.error("Error while sending tracking request: $e")
        }
    }

    private fun sendTrackingRequests(matomoRequests: List<MatomoRequest>) {
        if (matomoRequests.isNotEmpty()) {
            try {
                tracker.sendBulkRequestAsync(matomoRequests).exceptionally(::logMatomoErrors)
            } catch (e: Exception) {
                logger.error("Error while sending tracking request: $e")
            }
        }
    }

    private fun logMatomoErrors(exception: Throwable): Nothing? {
        when (exception.cause) {
            is MatomoException -> {
                logger.error("Could not send request to Matomo $exception")
            }

            else -> {
                logger.error("Unexpected error while sending request to Matomo $exception")
            }
        }
        return null
    }
}

private fun createEventRequest(
    matomoConfig: MatomoConfig,
    httpRequest: HttpServletRequest,
    eventAction: String,
    eventCategory: MatomoEventCategory,
    eventName: MatomoEventName,
    eventValue: Double?,
    dimensions: Map<Long, Any>,
): MatomoRequest =
    MatomoRequest.request()
        .siteId(matomoConfig.siteId)
        .authToken(matomoConfig.accessToken)
        .headerAcceptLanguage(AcceptLanguage.fromHeader(httpRequest.getHeader("Accept-Language")))
        .headerUserAgent(httpRequest.getHeader("User-Agent"))
        .visitorIp(httpRequest.remoteAddr)
        .eventAction(eventAction)
        .eventCategory(eventCategory.value)
        .eventName(eventName.value)
        .apply { eventValue?.let { eventValue(eventValue) } }
        .dimensions(dimensions)
        .build()

private fun createSearchRequest(
    matomoConfig: MatomoConfig,
    httpRequest: HttpServletRequest,
    eventAction: String,
    searchCategories: List<Int>?,
    searchText: String?,
    searchResultCount: Int,
): MatomoRequest =
    MatomoRequest.request()
        .siteId(matomoConfig.siteId)
        .authToken(matomoConfig.accessToken)
        .headerAcceptLanguage(AcceptLanguage.fromHeader(httpRequest.getHeader("Accept-Language")))
        .headerUserAgent(httpRequest.getHeader("User-Agent"))
        .visitorIp(httpRequest.remoteAddr)
        .eventAction(eventAction)
        .searchCategory(searchCategories?.joinToString(","))
        .searchQuery(searchText ?: "")
        .searchResultsCount(searchResultCount.toLong())
        .build()
