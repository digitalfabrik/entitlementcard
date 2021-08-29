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
    
    func waitForElementToAppear(element: XCUIElement, timeout: TimeInterval = 20, file: String = #file, line: UInt = #line) {
            let existsPredicate = NSPredicate(format: "exists == true")

        expectation(for: existsPredicate,
                    evaluatedWith: element, handler: nil)

        waitForExpectations(timeout: timeout) { (error) -> Void in
            if (error != nil) {
                let message = "Failed to find \(element) after \(timeout) seconds."
                self.recordFailure(withDescription: message, inFile: file, atLine: Int(line), expected: true)
            }
        }
    }
    
    func testOpenMap() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
        
        let element = app.staticTexts["Suche\nTab 2 von 3"]
        self.waitForElementToAppear(element: element)
        sleep(5)
        
        snapshot("01Map")
    }
    
    func testOpenSearch() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
        
        let element = app.staticTexts["Suche\nTab 2 von 3"]
        self.waitForElementToAppear(element: element)
        sleep(5)
        
        XCUIApplication().staticTexts["Suche\nTab 2 von 3"].tap()

        snapshot("01Search")
    }
    
    func testOpenDetail() throws {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
        
        let element = app.staticTexts["Suche\nTab 2 von 3"]
        self.waitForElementToAppear(element: element)
        sleep(5)
        
        app.staticTexts["Suche\nTab 2 von 3"].tap()
        let search = app.textFields["Tippen, um zu suchen …"]
        search.tap()
        

        search.tap()
        search.typeText("Alpha-Caf")
        search.typeText("\n") // Close keyboard for more space
        
        app.images.matching(identifier: "Essen/Trinken/Gastronomie").element(boundBy: 0).tap()

        // on ipads the list element is a "otherElements" element, on iphones it is a "staticTexts"
        var result = app.descendants(matching: .any).element(matching: NSPredicate(format: "label CONTAINS[c] %@", "Alpha"))
            
        //if (!result.exists || !result.isHittable) {
        //    result = app.otherElements.element(matching: NSPredicate(format: "label CONTAINS[c] %@", "Alpha"))
        //}
        result.tap()
        
        sleep(2)
        
        snapshot("01Detail")
    }
}
