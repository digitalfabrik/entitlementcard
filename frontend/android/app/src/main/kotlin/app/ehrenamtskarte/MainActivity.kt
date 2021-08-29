package app.ehrenamtskarte

import android.content.pm.PackageManager
import android.os.Bundle
import android.preference.PreferenceManager
import android.util.Log
import io.flutter.embedding.android.FlutterActivity
import java.io.File

class MainActivity: FlutterActivity() {

    private fun resetApp() {
        val m = packageManager
        try {
            val info = m.getPackageInfo(packageName, 0)
            deleteRecursive(File(info.applicationInfo.dataDir))
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e("WRAPPER", "Failed to get data directory!", e)
        }
    }

    private fun deleteRecursive(fileOrDirectory: File) {
        if (fileOrDirectory.isDirectory) {
            for (child in fileOrDirectory.listFiles()) {
                deleteRecursive(child)
            }
        }
        fileOrDirectory.delete()
    }

    private fun cleanITNRWData() {
        val m = packageManager
        try {
            val info = m.getPackageInfo(packageName, 0)
            val arcgisfile =
                File(info.applicationInfo.dataDir + File.separatorChar + "shared_prefs" + File.separatorChar + "com.esri.arcgisruntime.settings.xml")
            if (arcgisfile.exists()) {
                resetApp()
            }
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e("WRAPPER", "Failed to get data directory!", e)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        cleanITNRWData()
        super.onCreate(savedInstanceState)
    }
}
