plugins {
    `kotlin-dsl`
    kotlin("plugin.serialization") version "2.2.0"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(gradleApi())
    // TODO Upgrade to recent version -https://github.com/digitalfabrik/entitlementcard/issues/2357
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
}
