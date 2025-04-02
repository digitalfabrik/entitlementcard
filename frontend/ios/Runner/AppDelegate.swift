import UIKit
import Flutter

@main
@objc class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        clearITNRWStorage()
        
        if ProcessInfo.processInfo.arguments.contains("UI-Testing") {
            UserDefaults.standard.set(false, forKey: "flutter.firstStart");
        }
        
        GeneratedPluginRegistrant.register(with: self)
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
    
    func clearITNRWStorage() {
        let preferences = UserDefaults.standard
        let key = "preferencesSQLFilterString"
        
        if preferences.string(forKey: key) != nil {
            //clear preferences
            resetDefaults()
            
            //clear storage
            removeCache()
        }
    }
    
    func resetDefaults() {
        let defs = UserDefaults.standard
        let dict = defs.dictionaryRepresentation()
        for (key, _) in dict {
            defs.removeObject(forKey: key)
        }
        defs.synchronize()
    }
    
    func removeCache() {
        let manager = FileManager.default
        let paths = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).map(\.path)
        let libraryDirectory = paths[0]
        var directoryContent: [String]? = nil
        do {
            directoryContent = try manager.contentsOfDirectory(atPath: libraryDirectory)
            
            if let directoryContent = directoryContent {
                for content in directoryContent {
                    let path = URL(fileURLWithPath: libraryDirectory).appendingPathComponent(content).path
                    do {
                        try manager.removeItem(atPath: path)
                    } catch {
                    }
                }
            }
        } catch {
        }
    }
}
