package app.ehrenamtskarte.backend.stores.importer.utils

fun drawSuccessBar(done: Int, of: Int) {
    if (done % 200 == 0) {
        var bar = ""
        repeat(done / 200) { bar += "##" }
        var remaining = ""
        repeat((of - done) / 200) { remaining += "__" }
        println("[$bar$remaining]")
    }
}
