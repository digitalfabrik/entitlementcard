package app.ehrenamtskarte.backend.graphql.freinet.types

data class FreinetPerson(
    val user_status: String = "1",
    val vorname: String,
    val nachname: String,
    val geburtstag: String,
    val address: Map<String, FreinetAddress>,
    val user_id: Int? = null,
)

data class FreinetAddress(
    val adress_strasse: String?,
    val adress_plz: String?,
    val adress_ort: String?,
    val adress_mail1: String?,
    val adress_tel_p: String?,
)

data class FreinetProtocol(val title: String, val date: String)
