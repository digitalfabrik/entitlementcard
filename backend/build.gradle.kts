val isProductionEnvironment = System.getProperty("env") == "prod"

plugins {
    alias(libs.plugins.expediagroup.graphql)
    alias(libs.plugins.gitlab.arturbosch.detekt)
    alias(libs.plugins.gmazzo.buildconfig)
    alias(libs.plugins.google.protobuf)
    alias(libs.plugins.jetbrains.kotlin.jvm)
    alias(libs.plugins.jetbrains.kotlinx.kover)
    alias(libs.plugins.jetbrains.kotlin.spring)
    alias(libs.plugins.jlleitschuh.gradle.ktlint)
    alias(libs.plugins.sentry.jvm.gradle)
    alias(libs.plugins.springframework.boot)
    alias(libs.plugins.spring.dependencymanagement)
    // Apply the application plugin to add support for building a CLI application.
    application
}

group = "app.ehrenamtskarte.backend"
version = "0.0.1-SNAPSHOT"
description = "Backend for the Ehrenamtskarte system"

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

sourceSets {
    main {
        proto {
            srcDir("../specs")
        }
    }
    test {
        kotlin {
            srcDir("${layout.buildDirectory.get()}/generated/source/graphql")
        }
    }
}

buildConfig {
    packageName(project.group.toString())
    buildConfigField("VERSION_NAME", System.getProperty("NEW_VERSION_NAME", "1.0.0"))
    buildConfigField("COMMIT_HASH", System.getenv("CIRCLE_SHA1"))
}

protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:${libs.versions.protobuf.get()}"
    }
    generateProtoTasks {
        all().configureEach {
            builtins {
                create("kotlin")
            }
        }
    }
}

repositories {
    mavenCentral()
}


// Workaround for detekt with recent kotlin version, should be removed when detekt plugin v2.0.0 is stable
// https://github.com/detekt/detekt/issues/6198#issuecomment-2265183695
dependencyManagement {
    configurations.matching { it.name == "detekt" }.all {
        resolutionStrategy.eachDependency {
            if (requested.group == "org.jetbrains.kotlin") {
                useVersion(io.gitlab.arturbosch.detekt.getSupportedKotlinVersion())
            }
        }
    }
}

dependencies {
    annotationProcessor(libs.springframework.boot.configurationprocessor)

    // todo this prevents webserver to be run from CliktCommand; fix or remove
    // developmentOnly(libs.springframework.boot.devtools)

    implementation(libs.ajalt.clikt)
    implementation(libs.apache.commons.text)
    implementation(libs.apache.commons.csv)
    implementation(libs.auth0.java.jwt)
    implementation(libs.bouncycastle.bcpkix.jdk18on)
    implementation(libs.eatthepath.java.otp)
    implementation(libs.expediagroup.graphql.kotlin.schema.generator)
    implementation(libs.favre.lib.bcrypt)
    implementation(libs.fasterxml.jackson.dataformat.xml)
    implementation(libs.fasterxml.jackson.dataformat.yaml)
    implementation(libs.fasterxml.jackson.datatype.jsr310)
    implementation(libs.fasterxml.jackson.module.kotlin)
    implementation(libs.google.zxing.core)
    implementation(libs.google.protobuf.kotlin)
    implementation(libs.graphql.extended.scalars)
    implementation(libs.grundig.geojson.jackson)
    implementation(libs.jetbrains.exposed.core)
    implementation(libs.jetbrains.exposed.dao)
    implementation(libs.jetbrains.exposed.jdbc)
    implementation(libs.jetbrains.exposed.java.time)
    implementation(libs.jetbrains.kotlin.stdlib)
    implementation(libs.jetbrains.kotlin.reflect)
    implementation(libs.jetbrains.kotlinx.coroutines.reactor)
    implementation(libs.jetbrains.kotlinx.html.jvm)
    implementation(libs.jetbrains.kotlinx.serialization.json)
    implementation(libs.kohlschutter.junixsocket.common) { because("PostgreSQL Unix domain socket support") }
    implementation(libs.kohlschutter.junixsocket.core)
    implementation(libs.ktor.client.core.jvm)
    implementation(libs.ktor.client.cio.jvm)
    implementation(libs.piwik.matomo.java.tracker)
    implementation(libs.postgis.jdbc)
    implementation(libs.projectreactor.reactor.kotlinextensions)
    implementation(libs.sentry.springbootstarter)
    implementation(libs.simplejavamail)
    implementation(libs.springdoc.openapi.starter)
    implementation(libs.springframework.boot.starter.mail)
    implementation(libs.springframework.boot.starter.web)
    implementation(libs.springframework.boot.starter.webflux)
    implementation(libs.springframework.boot.starter.graphql)

    runtimeOnly(libs.postgresql.postgresql)

    testImplementation(libs.expediagroup.graphql.kotlin.client)
    testImplementation(libs.junit.jupiter)
    testImplementation(libs.junit.jupiter.params)
    testImplementation(libs.jetbrains.kotlin.test)
    testImplementation(libs.jetbrains.kotlin.test.juni5)
    testImplementation(libs.jetbrains.kotlinx.coroutines.test)
    testImplementation(libs.mockk)
    testImplementation(libs.projectreactor.reactor.test)
    testImplementation(libs.springframework.boot.starter.test)
    testImplementation(libs.springframework.boot.testcontainers)
    testImplementation(libs.testcontainers)
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)
    constraints {
        testImplementation(libs.apache.commons.compress) {
            because(
                "Replace transitive dependency in testcontainers to mitigate vulnerability: testcontainers/testcontainers-java#8338",
            )
        }
    }

    testRuntimeOnly(libs.junit.platform.launcher)
}

if (isProductionEnvironment) {
    sentry {
        // Generates a JVM (Java, Kotlin, etc.) source bundle and uploads your source code to Sentry.
        // This enables source context, allowing you to see your source
        // code as part of your stack traces in Sentry.
        includeSourceContext = true

        org = "digitalfabrik"
        projectName = "entitlementcard-backend"
        authToken = System.getenv("SENTRY_AUTH_TOKEN")
    }
}

detekt {
    // https://detekt.dev/docs/gettingstarted/gradle
    toolVersion = "1.23.8"
    config.setFrom(file("../detekt.yml"))
    buildUponDefaultConfig = true
    basePath = project.layout.projectDirectory.toString()
    ignoreFailures = true
}

ktlint {
    version.set("1.5.0")
    filter {
        exclude { it.file.path.contains("${layout.buildDirectory.get()}/generated/") }
    }
}

application {
    mainClass.set("${project.group}.EntryPointKt")
}

kover {
    reports {
        filters {
            includes {
                classes("${project.group}.*")
            }
        }
    }
}

tasks.processResources {
    // required to load graphql schema by spring-boot
    from("../specs") {
        include("*.graphql")
        into("specs")
    }
}

tasks.test {
    dependsOn("graphqlGenerateTestClient")
    useJUnitPlatform()
    environment("JWT_SECRET", "HelloWorld")
    environment("KOBLENZ_PEPPER", "123456789ABC")
}

val copyStyleTask = tasks.register<Copy>("copyStyle") {
    from(layout.projectDirectory.file("ehrenamtskarte-maplibre-style/style.json"))
    into(layout.buildDirectory.dir("resources/main/styles"))
}
tasks.named("classes") { dependsOn(copyStyleTask) }

tasks.generateProto {
    dependsOn(tasks.generateSentryBundleIdJava)
}

tasks.sentryCollectSourcesJava {
    dependsOn(tasks.generateProto)
}

tasks.graphqlGenerateTestClient {
    if (isProductionEnvironment) {
        dependsOn(tasks.generateSentryBundleIdJava)
        dependsOn(tasks.sentryCollectSourcesJava)
    }
    schemaFile.set(rootDir.parentFile.resolve("specs/backend-api.graphql"))
    packageName.set("${project.group}.generated")
    queryFiles.setFrom(fileTree("src/test/resources/graphql"))
}

tasks.register<JavaExec>("db-clear") {
    group = "application"
    mainClass = application.mainClass.get()
    classpath = sourceSets.main.get().runtimeClasspath
    args("db-clear")
}

tasks.register<JavaExec>("db-migrate") {
    group = "application"
    mainClass = application.mainClass.get()
    classpath = sourceSets.main.get().runtimeClasspath
    args("migrate")
}

tasks.register<JavaExec>("db-import-online") {
    group = "application"
    mainClass = application.mainClass.get()
    classpath = sourceSets.main.get().runtimeClasspath
    args("import")
}

tasks.register<JavaExec>("db-import-dev") {
    group = "application"
    mainClass = application.mainClass.get()
    classpath = sourceSets.main.get().runtimeClasspath
    args("db-import-dev", "src/dev/sql")
}

tasks.register("db-recreate") {
    group = "application"
    val dbClear = tasks.getByName("db-clear")
    val dbMigrate = tasks.getByName("db-migrate")
    val dbImportOnline = tasks.getByName("db-import-online")
    val dbImportDev = tasks.getByName("db-import-dev")
    dbMigrate.dependsOn(dbClear)
    dbImportOnline.dependsOn(dbMigrate)
    dbImportDev.dependsOn(dbImportOnline)
    this.dependsOn(dbImportDev)
}
