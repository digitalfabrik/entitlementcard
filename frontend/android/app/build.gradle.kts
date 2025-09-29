import android.databinding.tool.ext.capitalizeUS
import com.android.build.gradle.internal.cxx.configure.gradleLocalProperties
import java.nio.file.Paths

plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
    id("idea")
}

idea {
    module {
        isDownloadJavadoc = true
        isDownloadSources = true
    }
}


val buildConfigs = listOf(
    "bayern",
    "nuernberg",
    "koblenz"
)

android {
    val localProperties = gradleLocalProperties(projectDir, providers)

    namespace = "app.entitlementcard"
    compileSdk = 36
    ndkVersion = "28.1.13356709"

    defaultConfig {
        minSdk = 23
        targetSdk = 36
        multiDexEnabled = true
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        if (project.hasProperty("VERSION_CODE")) {
            versionCode = (project.property("VERSION_CODE") as String).toInt()
            versionName = project.property("VERSION_NAME") as String
        }
    }


    sourceSets {
        named("main") {
            java.srcDirs("src/main/kotlin")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    flavorDimensions.add("buildConfig")

    productFlavors {
        buildConfigs.forEach { buildConfigName ->
            create(buildConfigName) {
                val buildConfig = readBuildConfig(buildConfigName)
                applicationId = buildConfig.applicationId
                manifestPlaceholders["icon"] = buildConfig.appIcon
                manifestPlaceholders["appName"] = buildConfig.appName
                readResValues(buildConfigName).forEach {
                    resValue(it.type, it.name, it.value)
                }
            }
        }
    }

    lint {
        disable.add("InvalidPackage")
    }

    signingConfigs {
        if (System.getenv()["KEYSTORE_PATH"] != null) { // Signing with env variables (CI)
            println("Selected keystore using env variables")
            create("release") {
                storeFile = file("file://" + System.getProperty("user.home") + project.property("KEYSTORE_PATH"))
                storePassword = project.property("KEYSTORE_PASSWORD") as String
                keyAlias = project.property("KEYSTORE_KEY_ALIAS") as String
                keyPassword = project.property("KEYSTORE_KEY_PASSWORD") as String
            }
        } else if (localProperties.containsKey("signing.keyAlias")) { // Signing with local.properties file (locally)
            println("Selected keystore using localProps")
            create("localProps") {
                keyAlias = localProperties.getProperty("signing.keyAlias")
                keyPassword = localProperties.getProperty("signing.keyPassword")
                storeFile = file(localProperties.getProperty("signing.storeFile"))
                storePassword = localProperties.getProperty("signing.storePassword")
            }
        } else {
            println("Selecting debug keystore")
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".development"
            manifestPlaceholders["appNameSuffix"] = " DEV"
        }
        release {
            manifestPlaceholders["appNameSuffix"] = ""
            ndk {
                // Flutter does not support x86, so we exclude it in the following list: https://github.com/flutter/flutter/issues/9253
                abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a", "x86_64"))
            }

            signingConfig = signingConfigs.getByName(
                if (project.hasProperty("KEYSTORE_PATH"))
                    "release"
                else if (localProperties.containsKey("signing.keyAlias"))
                    "localProps"
                else
                    "debug"
            )


            // We need to configure proguard here because of some bug which occurred when adding flutter dependencies,
            // probably involving image-picker.
            // The workaround is from https://github.com/flutter/flutter/issues/58479.
            // Also have a look at https://github.com/ehrenamtskarte/ehrenamtskarte/issues/340
            // As of flutter_plugin_android_lifecycle 2.0.1, this should no longer be necessary.
            // Once upgrading to that version, we can remove the next line together with proguard-rules.pro.
            proguardFiles.add(getDefaultProguardFile("proguard-android-optimize.txt"))
            proguardFiles.add(file("proguard-rules.pro"))
        }
    }

    androidComponents {
        buildConfigs.forEach { buildConfigName ->
            onVariants(selector().withFlavor("buildConfig", buildConfigName)) { variant ->
                val buildConfig = readBuildConfig(buildConfigName)
                if (buildConfig.buildFeatures.excludeX86) {
                    // Verify this using:
                    // unzip -l frontend/build/app/outputs/apk/Bayern/debug/app-Bayern-debug.apk | grep x86
                    // unzip -l frontend/build/app/outputs/apk/Nuernberg/debug/app-Nuernberg-debug.apk | grep x86
                    variant.packaging.jniLibs.excludes.add("**/lib/x86**")
                }
                if (buildConfig.buildFeatures.excludeLocationPlayServices) {
                    // Verify this by opening the APKs in Android Studio/IntelliJ. Then select all the .dex files.
                    // Then see if there are files located at com.android.gms (Cursive files are not present, only referenced)
                    variant.compileConfiguration.exclude(
                        group = "com.google.android.gms",
                        module = "play-services-location"
                    )
                    variant.runtimeConfiguration.exclude(
                        group = "com.google.android.gms",
                        module = "play-services-location"
                    )
                }
            }
        }
    }
}

flutter {
    source = "../.."
}

/** Add checks verifying that the correct build config is used for the specified flavor. */
fun setupChecksForBuildConfig() {
    tasks.register("checkBuildConfig") {
        doFirst { throw GradleException("No flavor specified!") }
    }
    buildConfigs.forEach { buildConfigName ->
        tasks.register("checkBuildConfig" + buildConfigName.capitalizeUS()) {
            doFirst { assertBuildRunnerWasRunCorrectly(buildConfigName) }
            mustRunAfter("checkBuildConfig")
        }
    }
    val suffixRegex = Regex("(Release|Debug|Profile|Test|Unit|Android)$")
    tailrec fun removeSuffixes(name: String): String {
        val match = suffixRegex.find(name) ?: return name
        return removeSuffixes(name.substring(0, name.length - match.value.length))
    }
    tasks.whenTaskAdded {
        if (name.startsWith("assemble")) {
            val buildConfigName = removeSuffixes(name.substring("assemble".length))
            dependsOn("checkBuildConfig" + buildConfigName.capitalizeUS())
        }
    }
}

fun assertBuildRunnerWasRunCorrectly(buildConfigName: String) {
    val buildRunnerCmd = "fvm dart run build_runner build --define \"df_build_config=name=${buildConfigName}\""
    val generatedDartFile = Paths.get(rootDir.path, "../lib/build_config/build_config.dart").toFile()
    if (!generatedDartFile.exists()) {
        val msg = "The dart build runner was not executed. Run `$buildRunnerCmd`!"
        throw GradleException(msg)
    }
    val generatedDartText = generatedDartFile.readText()
    if (!generatedDartText.contains("String buildConfigName = \"${buildConfigName}\";")) {
        val msg = "The dart build runner was not run with the correct build config. Run `${buildRunnerCmd}`!"
        throw GradleException(msg)
    }
}

setupChecksForBuildConfig()
