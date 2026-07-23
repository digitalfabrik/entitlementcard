package app.ehrenamtskarte.backend.shared

import app.ehrenamtskarte.backend.config.BackendConfiguration
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
        sendTrackingRequests(
            projectConfig = projectConfig,
            httpRequest = request,
            requestBuilders = listOfNotNull(
                if (numberOfStaticCards > 0) {
                    MatomoRequest.request()
                        .eventAction(query)
                        .eventCategory(MatomoEventCategory.valueOf(CodeType.STATIC.name).value)
                        .eventName(MatomoEventName.CARD_CREATION_SUCCESSFUL.value)
                        .eventValue(numberOfStaticCards.toDouble())
                        .dimensions(mapOf(1L to regionId))
                } else {
                    null
                },
                if (numberOfDynamicCards > 0) {
                    MatomoRequest.request()
                        .eventAction(query)
                        .eventCategory(MatomoEventCategory.valueOf(CodeType.DYNAMIC.name).value)
                        .eventName(MatomoEventName.CARD_CREATION_SUCCESSFUL.value)
                        .eventValue(numberOfDynamicCards.toDouble())
                        .dimensions(mapOf(1L to regionId))
                } else {
                    null
                },
            ),
        )
    }

    fun trackVerification(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        card: CardEntity?,
        codeType: CodeType,
        successful: Boolean,
    ) {
        sendTrackingRequests(
            projectConfig = projectConfig,
            httpRequest = request,
            requestBuilders = listOf(
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
                    .dimensions(if (card != null) mapOf(1L to card.regionId) else emptyMap()),
            ),
        )
    }

    fun trackActivation(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        cardEntity: CardEntity?,
        cardActivationState: ActivationState,
    ) {
        sendTrackingRequests(
            projectConfig = projectConfig,
            httpRequest = request,
            requestBuilders = listOf(
                MatomoRequest.request()
                    .eventAction(query)
                    .eventCategory(MatomoEventCategory.ACTIVATION.value)
                    .eventName(
                        if (cardActivationState == ActivationState.success) {
                            MatomoEventName.ACTIVATION_SUCCESSFUL.value
                        } else {
                            MatomoEventName.ACTIVATION_FAILED.value
                        },
                    )
                    .eventValue(if (cardActivationState == ActivationState.success) 1.0 else 0.0)
                    .dimensions(if (cardEntity != null) mapOf(1L to cardEntity.regionId) else emptyMap()),
            ),
        )
    }

    fun trackSearch(
        projectConfig: ProjectConfig,
        request: HttpServletRequest,
        query: String,
        params: SearchParams,
        numResults: Int,
    ) {
        if (params.searchText != null || params.categoryIds != null) {
            sendTrackingRequests(
                projectConfig = projectConfig,
                httpRequest = request,
                requestBuilders = listOf(
                    MatomoRequest.request()
                        .actionName(query)
                        .searchCategory(params.categoryIds?.joinToString(","))
                        .searchQuery(params.searchText ?: "")
                        .searchResultsCount(numResults.toLong()),
                ),
            )
        }
    }

    private fun sendTrackingRequests(
        projectConfig: ProjectConfig,
        httpRequest: HttpServletRequest,
        requestBuilders: List<MatomoRequest.MatomoRequestBuilder>,
    ) {
        projectConfig.matomo?.let { matomoConfig ->
            if (requestBuilders.isNotEmpty()) {
                // Also catch synchronous exceptions
                try {
                    tracker.sendBulkRequestAsync(
                        requestBuilders.map {
                            it.siteId(matomoConfig.siteId)
                            it.authToken(matomoConfig.accessToken)
                            it.headerAcceptLanguage(AcceptLanguage.fromHeader(httpRequest.getHeader("Accept-Language")))
                            it.headerUserAgent(httpRequest.getHeader("User-Agent"))
                            it.visitorIp(httpRequest.remoteAddr)
                            it.build()
                        },
                    ).exceptionally { exception ->
                        when (exception) {
                            is MatomoException -> {
                                logger.error("Could not send request to Matomo $exception")
                            }

                            else -> {
                                logger.error("Unexpected error while sending request to Matomo $exception")
                            }
                        }
                        null
                    }
                } catch (e: Throwable) {
                    logger.error("Error while sending tracking request: $e")
                }
            }
        }
    }
}
