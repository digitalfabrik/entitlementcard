package app.ehrenamtskarte.backend.verification.service

import app.ehrenamtskarte.backend.common.utils.executeAndMapSelectStatement
import app.ehrenamtskarte.backend.verification.webservice.schema.types.CardStatisticsResultModel

object CardStatistics {

    // TODO passProper endDate, use const for column names
    fun getCardStatisticsPerProject(project: String, dateStart: String, dateEnd: String): List<CardStatisticsResultModel> {
        val query = """WITH allCards AS
  (SELECT concat(PREFIX, ' ', name) AS Region,
          count("regionId") AS COUNT
   FROM cards
   JOIN public.regions ON "regionId" = public.regions.id
   JOIN projects ON "projectId" = projects.id
   WHERE projects.project = '$project'
     AND "codeType" = 1
     AND "issueDate" BETWEEN '$dateStart' AND '$dateEnd 23:59:59'
   GROUP BY name,
            PREFIX
   ORDER BY name,
            PREFIX),
     activatedCards AS
  (SELECT concat(PREFIX, ' ', name) AS Region,
          count("regionId") AS COUNT
   FROM cards
   JOIN public.regions ON "regionId" = public.regions.id
   JOIN projects ON "projectId" = projects.id
   WHERE projects.project = '$project'
     AND "codeType" = 1
     AND "firstActivationDate" IS NOT NULL
     AND "issueDate" BETWEEN '$dateStart' AND '$dateEnd 23:59:59'
   GROUP BY name,
            PREFIX
   ORDER BY name,
            PREFIX)
  SELECT allCards.Region,
       allCards.count AS "Erstellte Karten",
       COALESCE(activatedCards.count, 0) AS "Aktivierte Karten"
   FROM allCards
   LEFT JOIN activatedCards ON allCards.Region = activatedCards.Region;"""

        val cards = query.executeAndMapSelectStatement { rs ->
            CardStatisticsResultModel(
                region = rs.getString("region"),
                cardsCreated = rs.getString("Erstellte Karten").toInt(),
                cardsActivated = rs.getString("Aktivierte Karten").toInt()
            )
        }
        return cards
    }
}
