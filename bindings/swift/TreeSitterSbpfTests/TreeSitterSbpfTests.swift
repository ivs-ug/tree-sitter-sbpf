import XCTest
import SwiftTreeSitter
import TreeSitterSbpf

final class TreeSitterSbpfTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_sbpf())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading sBPF grammar")
    }
}
