import Foundation
import Parsing

private enum Pipe {
    case None
    case EastWest
    case NorthSouth
    case NorthEast
    case NorthWest
    case SouthWest
    case SouthEast
    case Starting
}

private enum Direction {
    case North
    case East
    case South
    case West
}

private struct Location {
    var x: Int
    var y: Int
}

private func readInput() -> [[Pipe]]? {
    if let input = try? String(contentsOfFile: "input/day-10.txt") {
        let parser = Parse(input: Substring.self) {
            Many {
                Many {
                    OneOf {
                        "|".map { Pipe.NorthSouth }
                        "-".map { Pipe.EastWest }
                        "L".map { Pipe.NorthEast }
                        "J".map { Pipe.NorthWest }
                        "7".map { Pipe.SouthWest }
                        "F".map { Pipe.SouthEast }
                        ".".map { Pipe.None }
                        "S".map { Pipe.Starting }
                    }
                }
            } separator: {
                "\n"
            }
        }

        return try? parser.parse(input)
    }
    return nil
}

private func getLoopStart(map: [[Pipe]]) -> Location {
    for (y, line) in map.enumerated() {
        for (x, pipe) in line.enumerated() {
            if pipe == Pipe.Starting {
                return Location(x: x, y: y)
            }
        }
    }
    return Location(x: 0, y: 0)
}

// I know from looking at my map that my starting point can go only
// west or east, so I'll start east
private func getLoopLength(loopStart: Location, map: [[Pipe]]) -> Int {
    var fromDirection = Direction.West
    var currentLocation = Location(x: loopStart.x + 1, y: loopStart.y)
    var steps = 1

    while map[currentLocation.y][currentLocation.x] != Pipe.Starting {
        switch map[currentLocation.y][currentLocation.x] {
        case Pipe.EastWest:
            if fromDirection == Direction.West {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.x -= 1
                fromDirection = Direction.East
            }
        case Pipe.NorthEast:
            if fromDirection == Direction.North {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.NorthSouth:
            if fromDirection == Direction.North {
                currentLocation.y += 1
                fromDirection = Direction.North
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.NorthWest:
            if fromDirection == Direction.North {
                currentLocation.x -= 1
                fromDirection = Direction.East
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.SouthEast:
            if fromDirection == Direction.South {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.y += 1
                fromDirection = Direction.North
            }
        case Pipe.SouthWest:
            if fromDirection == Direction.South {
                currentLocation.x -= 1
                fromDirection = Direction.East
            } else {
                currentLocation.y += 1
                fromDirection = Direction.North
            }
        default:
            break
        }
        steps += 1
    }

    return steps
}

// Again, this is not a general purpose solution because I know my
// map starts with an east-west square.
private func simplifyLoopMap(loopStart: Location, map: [[Pipe]]) -> [[Pipe]] {
    var fromDirection = Direction.West
    var currentLocation = Location(x: loopStart.x + 1, y: loopStart.y)
    var newMap: [[Pipe]] = Array(repeating: Array(repeating: Pipe.None, count: map[0].count), count: map.count)

    newMap[loopStart.y][loopStart.x] = Pipe.EastWest

    while map[currentLocation.y][currentLocation.x] != Pipe.Starting {
        newMap[currentLocation.y][currentLocation.x] = map[currentLocation.y][currentLocation.x]

        switch map[currentLocation.y][currentLocation.x] {
        case Pipe.EastWest:
            if fromDirection == Direction.West {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.x -= 1
                fromDirection = Direction.East
            }
        case Pipe.NorthEast:
            if fromDirection == Direction.North {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.NorthSouth:
            if fromDirection == Direction.North {
                currentLocation.y += 1
                fromDirection = Direction.North
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.NorthWest:
            if fromDirection == Direction.North {
                currentLocation.x -= 1
                fromDirection = Direction.East
            } else {
                currentLocation.y -= 1
                fromDirection = Direction.South
            }
        case Pipe.SouthEast:
            if fromDirection == Direction.South {
                currentLocation.x += 1
                fromDirection = Direction.West
            } else {
                currentLocation.y += 1
                fromDirection = Direction.North
            }
        case Pipe.SouthWest:
            if fromDirection == Direction.South {
                currentLocation.x -= 1
                fromDirection = Direction.East
            } else {
                currentLocation.y += 1
                fromDirection = Direction.North
            }
        default:
            break
        }
    }

    return newMap
}

private func printMap(map: [[Pipe]]) {
    for line in map {
        for pipe in line {
            switch pipe {
            case Pipe.NorthSouth:
                print("|", terminator: "")
            case Pipe.EastWest:
                print("-", terminator: "")
            case Pipe.NorthEast:
                print("L", terminator: "")
            case Pipe.NorthWest:
                print("J", terminator: "")
            case Pipe.SouthWest:
                print("7", terminator: "")
            case Pipe.SouthEast:
                print("F", terminator: "")
            case Pipe.None:
                print(".", terminator: "")
            default:
                break
            }
        }
        print("")
    }
}

// Using a (sort of) winding loop algorithm
// To determine if a point is inside a polygon, you can draw a line through
// polygon and the point, starting from one end count the number of times
// the line crosses the polygon, if the count is odd when you reach the point
// the point is inside.
// I'm drawing horizontal lines across each row
// since we only have right angle connectors, I'm only counting the pipes
// that connect to the square below as a vertical section (only above would
// work too)
private func countInsideArea(map: [[Pipe]]) -> Int {
    var area = 0
    for line in map {
        var windingCount = 0

        for pipe in line {
            switch pipe {
            case Pipe.NorthSouth:
                windingCount += 1
            case Pipe.SouthWest:
                windingCount += 1
            case Pipe.SouthEast:
                windingCount += 1
            case Pipe.None:
                if windingCount % 2 == 1 {
                    area += 1
                }
            default:
                break
            }
        }
    }
    return area
}

func day10a() {
    if let map = readInput() {
        let loopStart = getLoopStart(map: map)
        print(getLoopLength(loopStart: loopStart, map: map) / 2)
    }
}

func day10b() {
    if let map = readInput() {
        let loopStart = getLoopStart(map: map)
        let map = simplifyLoopMap(loopStart: loopStart, map: map)
        print(countInsideArea(map: map))
    }
}
