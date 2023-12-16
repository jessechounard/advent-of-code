import Foundation

private enum Thing: String {
    case RoundedRock = "O"
    case CubeRock = "#"
    case Empty = "."
}

private enum Direction {
    case Up
    case Right
    case Down
    case Left
}

private func readInput() -> [[Thing]]? {
    if let input = try? String(contentsOfFile: "input/day-14.txt") {
        let lines = input.split(separator: "\n")
        return lines.map {
            $0.map {
                $0 == "O" ? Thing
                    .RoundedRock : ($0 == "#" ? Thing.CubeRock : Thing.Empty)
            }
        }
    }
    return nil
}

private func rotateGrid(_ grid: [[Thing]]) -> [[Thing]] {
    var rotated: [[Thing]] = Array(
        repeating: Array(repeating: Thing.Empty, count: grid.count),
        count: grid[0].count
    )

    for (y, row) in grid.enumerated() {
        for (x, thing) in row.enumerated() {
            rotated[x][y] = thing
        }
    }

    return rotated
}

private func move(_ grid: inout [[Thing]], _ direction: Direction) {
    if direction == Direction.Left || direction == Direction.Right {
        let from = direction == Direction.Left ? 0 : grid[0].count - 1
        let to = direction == Direction.Left ? grid[0].count : -1
        let by = direction == Direction.Left ? 1 : -1

        for y in 0 ..< grid.count {
            var move = -1

            for x in stride(from: from, to: to, by: by) {
                if move == -1 {
                    if grid[y][x] == Thing.Empty {
                        move = x
                    }
                } else {
                    if grid[y][x] == Thing.RoundedRock {
                        (grid[y][x], grid[y][move]) = (
                            grid[y][move],
                            grid[y][x]
                        )
                        move += by
                    } else if grid[y][x] == Thing.CubeRock {
                        move = -1
                    }
                }
            }
        }
    } else {
        let from = direction == Direction.Up ? 0 : grid.count - 1
        let to = direction == Direction.Up ? grid.count : -1
        let by = direction == Direction.Up ? 1 : -1

        for x in 0 ..< grid[0].count {
            var move = -1

            for y in stride(from: from, to: to, by: by) {
                if move == -1 {
                    if grid[y][x] == Thing.Empty {
                        move = y
                    }
                } else {
                    if grid[y][x] == Thing.RoundedRock {
                        (grid[y][x], grid[move][x]) = (
                            grid[move][x],
                            grid[y][x]
                        )
                        move += by
                    } else if grid[y][x] == Thing.CubeRock {
                        move = -1
                    }
                }
            }
        }
    }
}

private func cycle(_ grid: inout [[Thing]]) {
    move(&grid, Direction.Up)
    move(&grid, Direction.Left)
    move(&grid, Direction.Down)
    move(&grid, Direction.Right)
}

private func countWeight(_ grid: [[Thing]]) -> Int {
    var weight = 0
    let height = grid.count
    for y in 0 ..< grid.count {
        for x in 0 ..< grid[y].count {
            if grid[y][x] == Thing.RoundedRock {
                weight += height - y
            }
        }
    }
    return weight
}

private func makeString(_ grid: [[Thing]]) -> String {
    var result = ""
    var empty = 0

    for line in grid {
        for thing in line {
            if thing != Thing.Empty, empty != 0 {
                result += String(empty)
                empty = 0
            }
            if thing == Thing.CubeRock {
                result += "#"
            } else if thing == Thing.RoundedRock {
                result += "O"
            } else {
                empty += 1
            }
        }
    }
    if empty != 0 {
        result += String(empty)
    }
    return result
}

private func printGrid(_ grid: [[Thing]]) {
    for line in grid {
        for thing in line {
            print(thing.rawValue, terminator: "")
        }
        print("")
    }
    print("")
}

func day14a() {
    if let things = readInput() {
        var things = things
        move(&things, Direction.Up)
        print(countWeight(things))
    }
}

func day14b() {
    if let things = readInput() {
        var things = things
        var states: [String: Int] = [:]
        var cycles = 0

        var state = makeString(things)
        while !states.keys.contains(state) {
            states[state] = cycles
            cycle(&things)
            cycles += 1
            state = makeString(things)
        }

        let cyclesRemaining = 1_000_000_000 - cycles
        let cycleLength = cycles - states[state]!
        let cyclesRemainingAfter = cyclesRemaining % cycleLength

        for _ in 0 ..< cyclesRemainingAfter {
            cycle(&things)
        }

        print(countWeight(things))
    }
}
