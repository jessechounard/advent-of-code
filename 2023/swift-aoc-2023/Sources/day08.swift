import Foundation
import Parsing

private enum Direction {
    case Left
    case Right
}

private struct Map {
    var directions: [Direction]
    var destinations: [String: (String, String)]
}

private func readInput() -> Map? {
    if let input = try? String(contentsOfFile: "input/day-08.txt") {
        let parser = Parse(input: Substring.self) {
            Many {
                OneOf {
                    "L".map { Direction.Left }
                    "R".map { Direction.Right }
                }
            }
            Many {
                Whitespace()
                PrefixUpTo(" ").map(String.init)
                " = ("
                PrefixUpTo(",").map(String.init)
                ", "
                PrefixUpTo(")").map(String.init)
                ")"
            }
        }

        do {
            let result = try parser.parse(input)
            let destinations = result.1.reduce(into: [String: (String, String)]()) { $0[$1.0] = ($1.1, $1.2) }
            return Map(directions: result.0, destinations: destinations)
        } catch {
            print(error)
        }
    }

    return nil
}

func day08a() {
    if let map = readInput() {
        var location = "AAA"
        var moves = 0
        var index = 0

        while location != "ZZZ" {
            if let next = map.destinations[location] {
                location = map.directions[index] == Direction.Left ? next.0 : next.1
                moves += 1
                index = (index + 1) % map.directions.count
            } else {
                print("There was a disturbance in the force")
                return
            }
        }

        print(moves)
    }
}

private func lcm(first: Int, second: Int) -> Int {
    first * second / gcd(first: first, second: second)
}

private func gcd(first: Int, second: Int) -> Int {
    var max = max(first, second)
    var min = min(first, second)
    var remainder = max % min

    while remainder != 0 {
        max = min
        min = remainder
        remainder = max % min
    }
    return min
}

func day08b() {
    if let map = readInput() {
        var locationsA: [String] = []
        for location in map.destinations.keys {
            if location.hasSuffix("A") {
                locationsA.append(location)
            }
        }

        // This feels like cheating. I identified that each ghost only
        // hits one z location before reaching its looping point.
        // So we can use the number of moves from each and find the
        // least common multiple. This could have been way harder, and
        // makes this code not a general purpose solution.
        var zIndices: [Int] = []

        for initialLocation in locationsA {
            var moves = 0
            var index = 0
            var states = Set<String>()

            var location = initialLocation
            var state = location + String(index)

            while !states.contains(state) {
                if let next = map.destinations[location] {
                    states.insert(state)
                    location = map.directions[index] == Direction.Left ? next.0 : next.1
                    moves += 1

                    if location.hasSuffix("Z") {
                        zIndices.append(moves)
                    }

                    index = (index + 1) % map.directions.count
                    state = location + String(index)
                } else {
                    print("There was a disturbance in the force")
                    return
                }
            }
        }

        print(zIndices.reduce(zIndices[0]) { lcm(first: $0, second: $1) })
    }
}
