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
        app.textFields["Tippen, um zu suchen …"].tap()
        
        let kKey = app/*@START_MENU_TOKEN@*/.keys["K"]/*[[".keyboards.keys[\"K\"]",".keys[\"K\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/
        let aKey = app/*@START_MENU_TOKEN@*/.keys["a"]/*[[".keyboards.keys[\"a\"]",".keys[\"a\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/
        let fKey = app/*@START_MENU_TOKEN@*/.keys["f"]/*[[".keyboards.keys[\"f\"]",".keys[\"f\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/
        let eKey = app/*@START_MENU_TOKEN@*/.keys["e"]/*[[".keyboards.keys[\"e\"]",".keys[\"e\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/
        
        app/*@START_MENU_TOKEN@*/.buttons["shift"]/*[[".keyboards",".buttons[\"Umschalt\"]",".buttons[\"shift\"]"],[[[-1,2],[-1,1],[-1,0,1]],[[-1,2],[-1,1]]],[0]]@END_MENU_TOKEN@*/.tap()
        kKey.tap()
        aKey.tap()
        fKey.tap()
        fKey.tap()
        eKey.tap()
        app.images["Essen/Trinken/Gastronomie"].tap()
        
        var result = app.staticTexts.element(matching: NSPredicate(format: "label CONTAINS[c] %@", "Alpha"))
            
        if (!result.exists) {
            result = app.otherElements.element(matching: NSPredicate(format: "label CONTAINS[c] %@", "Alpha"))
        }
        result.tap()
        
        snapshot("01Detail")
    }
}
