import org.gradle.api.tasks.Delete

rootProject.layout.buildDirectory.set(file("../build"))

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

subprojects {
    project.layout.buildDirectory.set(file("${rootProject.layout.buildDirectory.get()}/${project.name}"))
    project.evaluationDependsOn(":app")

    // maplibre_gl 0.27.0 only applies the Kotlin plugin itself below AGP 9, assuming AGP 9+
    // https://github.com/maplibre/flutter-maplibre-gl/pull/914
    // This workaround is required until https://github.com/digitalfabrik/entitlementcard/issues/3126
    if (project.name == "maplibre_gl") {
        pluginManager.apply("org.jetbrains.kotlin.android")
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory.get())
}
