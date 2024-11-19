//
//  ScreenshotTests.swift
//  ScreenshotTests
//
//  Created by Ehrenamtskarte on 29.08.21.
//

import XCTest

class ScreenshotTests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = true
    }

    override func tearDownWithError() throws {
    
    }
    
    func getBundleId(from app: XCUIApplication) -> String {
        guard let bundleID = app.launchEnvironment.first(where: { $0.key == "BUNDLE_IDENTIFIER" })?.value else {
            return ProcessInfo().environment.first { $0.key == "BUNDLE_IDENTIFIER" }?.value ?? "";
        }
        return bundleID
    }
    
    func waitForElementToAppear(element: XCUIElement, timeout: TimeInterval = 20) {
            let existsPredicate = NSPredicate(format: "exists == true")

        expectation(for: existsPredicate,
                    evaluatedWith: element, handler: nil)

        waitForExpectations(timeout: timeout) { (error) -> Void in
            if (error != nil) {
                let message = "Failed to find \(element) after \(timeout) seconds."
                self.record(XCTIssue(type: XCTIssue.IssueType.assertionFailure, compactDescription: message)
)
            }
        }
    }
    
    @MainActor
    func testOpenMap() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launchArguments += ["UI-Testing"]
        app.launch()

        let element = app.staticTexts["Suche\nTab 2 von 4"]
        self.waitForElementToAppear(element: element)
        sleep(60)
        snapshot("01Map")
    }

    @MainActor
    func testOpenSearch() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launchArguments += ["UI-Testing"]
        app.launch()

        let tabItem = app.staticTexts["Suche\nTab 2 von 4"]
        self.waitForElementToAppear(element: tabItem)
        sleep(5)

        tabItem.tap()
        snapshot("01Search")
    }

    @MainActor
    func testOpenDetail() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launchArguments += ["UI-Testing"]
        app.launch()

        let tabItem = app.staticTexts["Suche\nTab 2 von 4"]
        self.waitForElementToAppear(element: tabItem)
        sleep(5)

        tabItem.tap()
        let search = app.textFields.firstMatch
        self.waitForElementToAppear(element: search)
        search.tap()

        // Default Bayern
        var searchText = "Eiscafe"
        var category = "Essen/Trinken/Gastronomie"
        var expectedMatch = "Dolomiti"
        if (self.getBundleId(from: app) == "app.sozialpass.nuernberg"){
           searchText = "Ahorn"
           category = "Apotheken/Gesundheit"
           expectedMatch = "Ahorn Apotheke"
       }

        if (self.getBundleId(from: app) == "app.sozialpass.koblenz"){
            searchText = "Ludwig"
            category = "Kultur/Museen/Freizeit"
            expectedMatch = "Ludwig Museum Koblenz"
        }

        search.typeText(searchText)
        search.typeText("\n") // Close keyboard for more space
        sleep(10)

        app.images.matching(identifier: category).element(boundBy: 0).tap()
        // on ipads the list element is a "otherElements" element, on iphones it is a "staticTexts"
        var result = app.descendants(matching: .any).element(matching: NSPredicate(format: "label CONTAINS[c] %@", expectedMatch))

        if (!result.exists || !result.isHittable) {
            result = app.otherElements.element(matching: NSPredicate(format: "label CONTAINS[c] %@", expectedMatch))
        }
        sleep(10)
        result.tap()

        sleep(2)

        snapshot("01Detail")
    }
}
