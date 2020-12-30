package xyz.elitese.ehrenamtskarte.importer.freinet.converters

import com.beust.klaxon.Converter
import com.beust.klaxon.JsonValue

val integerConverter = object: Converter {

    override fun canConvert(cls: Class<*>)
            = cls == String::class.java

    override fun toJson(value: Any): String {
        TODO("Not yet implemented")
    }

    override fun fromJson(jv: JsonValue) = jv.string!!.toInt()

}
