import Foundation
import Parsing

private enum Space {
    case Empty
    case Galaxy
}

private struct Location {
    var x: Int
    var y: Int
}

private func readInput() -> [[Space]]? {
    if let input = try? String(contentsOfFile: "input/day-11.txt") {
        let parser = Parse(input: Substring.self) {
            Many {
                Many {
                    OneOf {
                        ".".map { Space.Empty }
                        "#".map { Space.Galaxy }
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

private func findEmpty(space: [[Space]]) -> (Set<Int>, Set<Int>) {
    var emptyRows = Set(0 ... (space.count - 1))
    var emptyColumns = Set(0 ... (space[0].count - 1))

    for y in 0 ... (space.count - 1) {
        for x in 0 ... (space[0].count - 1) {
            if space[y][x] != Space.Empty {
                emptyRows.remove(y)
                emptyColumns.remove(x)
            }
        }
    }

    return (emptyRows, emptyColumns)
}

private func printSpace(space: [[Space]]) {
    for rows in space {
        for s in rows {
            switch s {
            case Space.Galaxy:
                print("#", terminator: "")
            default:
                print(".", terminator: "")
            }
        }
        print("")
    }
}

private func findGalaxies(space: [[Space]]) -> [Int: Location] {
    var galaxies: [Int: Location] = [:]
    var next = 0

    for (y, row) in space.enumerated() {
        for (x, s) in row.enumerated() {
            if s != Space.Empty {
                galaxies[next] = Location(x: x, y: y)
                next += 1
            }
        }
    }

    return galaxies
}

private func getDistance(galaxyNumberA: Int,
                         galaxyNumberB: Int,
                         galaxies: [Int: Location],
                         emptyRows: Set<Int>,
                         emptyColumns: Set<Int>,
                         expansion: Int) -> Int
{
    if let galaxyA = galaxies[galaxyNumberA],
       let galaxyB = galaxies[galaxyNumberB]
    {
        let emptyWidth = Set(min(galaxyA.x, galaxyB.x) ..< max(
            galaxyA.x,
            galaxyB.x
        ))
        .intersection(emptyColumns).count * expansion
        let emptyHeight = Set(min(galaxyA.y, galaxyB.y) ..< max(
            galaxyA.y,
            galaxyB.y
        ))
        .intersection(emptyRows).count * expansion
        return abs(galaxyA.x - galaxyB.x) + abs(galaxyA.y - galaxyB.y) +
            emptyWidth + emptyHeight
    }
    return 0
}

func day11a() {
    if let space = readInput() {
        let galaxies = findGalaxies(space: space)
        let (emptyRows, emptyColumns) = findEmpty(space: space)
        let galaxyNumbers = Array(galaxies.keys)

        var sum = 0

        for (i, g1) in galaxyNumbers.enumerated() {
            for j in i + 1 ..< galaxyNumbers.count {
                let g2 = galaxyNumbers[j]

                sum += getDistance(
                    galaxyNumberA: g1,
                    galaxyNumberB: g2,
                    galaxies: galaxies,
                    emptyRows: emptyRows,
                    emptyColumns: emptyColumns,
                    expansion: 1
                )
            }
        }

        print(sum)
    }
}

func day11b() {
    if let space = readInput() {
        let galaxies = findGalaxies(space: space)
        let (emptyRows, emptyColumns) = findEmpty(space: space)
        let galaxyNumbers = Array(galaxies.keys)

        var sum = 0

        for (i, g1) in galaxyNumbers.enumerated() {
            for j in i + 1 ..< galaxyNumbers.count {
                let g2 = galaxyNumbers[j]

                sum += getDistance(
                    galaxyNumberA: g1,
                    galaxyNumberB: g2,
                    galaxies: galaxies,
                    emptyRows: emptyRows,
                    emptyColumns: emptyColumns,
                    expansion: 999_999
                )
            }
        }

        print(sum)
    }
}
