// I couldn't figure this one out, so I ported a very clever looking
// solution I saw on Reddit to study.
//
// Pushing this to github for preservation, but I didn't come up
// with this solution.
// Original credit: Juan Lopes on github
// https://github.com/juanplopes/advent-of-code-2023/blob/main/day12.py

import Foundation
import Parsing

extension RawRepresentable where RawValue == String {
    var description: String { rawValue }
}

enum Spring: String, CustomStringConvertible {
    case Functional = "."
    case Broken = "#"
    case Unknown = "?"
}

private func readInput() -> [([Spring], [Int])]? {
    if let input = try? String(contentsOfFile: "input/day-12.txt") {
        let parser = Parse(input: Substring.self) {
            Many {
                Many {
                    OneOf {
                        ".".map { Spring.Functional }
                        "#".map { Spring.Broken }
                        "?".map { Spring.Unknown }
                    }
                } terminator: {
                    " "
                }
                Whitespace()
                Many {
                    Digits()
                } separator: {
                    ","
                }
            } separator: {
                "\n"
            }
        }

        return try? parser.parse(input)
    }
    return nil
}

private func solve(springs: [Spring], counts: [Int]) -> Int {
    func advance(_ i: Int, _ j: Int) -> Int {
        if j >= counts.count {
            return 0
        }
        if springs.count - i < counts[j] {
            return 0
        }
        if springs[i ..< i + counts[j]].contains(Spring.Functional) {
            return 0
        }
        if springs.count - i == counts[j] {
            return dp(springs.count, j + 1)
        }
        if springs[i + counts[j]] == Spring
            .Functional || springs[i + counts[j]] == Spring.Unknown
        {
            return dp(i + counts[j] + 1, j + 1)
        } else {
            return 0
        }
    }

    // I don't know how to memoize in Swift, so I'm just manually caching here

    var dpCache: [String: Int] = [:]

    func dp(_ i: Int, _ j: Int) -> Int {
        let params = String(i) + ":" + String(j)
        if let cached = dpCache[params] {
            return cached
        }

        if i >= springs.count {
            let result = j >= counts.count ? 1 : 0
            dpCache[params] = result
            return result
        }
        if springs[i] == Spring.Functional {
            let result = dp(i + 1, j)
            dpCache[params] = result
            return result
        }
        if springs[i] == Spring.Broken {
            let result = advance(i, j)
            dpCache[params] = result
            return result
        }
        let result = dp(i + 1, j) + advance(i, j)
        dpCache[params] = result
        return result
    }

    return dp(0, 0)
}

private func multiplySprings(_ springs: [Spring]) -> [Spring] {
    let newSprings = springs + [Spring.Unknown]
    return newSprings + newSprings + newSprings + newSprings + springs
}

private func multiplyCounts(_ counts: [Int]) -> [Int] {
    counts + counts + counts + counts + counts
}

func day12a() {
    if let input = readInput() {
        print(input.reduce(0) { $0 + solve(springs: $1.0, counts: $1.1) })
    }
}

func day12b() {
    if let input = readInput() {
        print(input.reduce(0) { $0 + solve(
            springs: multiplySprings($1.0),
            counts: multiplyCounts($1.1)
        ) })
    }
}
