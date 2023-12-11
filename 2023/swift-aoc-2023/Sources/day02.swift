import Foundation
import Parsing

enum Color { case red, green, blue }

func parseGame(gameString: String) -> (Int, [[(Int, Color)]])? {
    let parser = Parse {
        "Game "
        Int.parser()
        ":"
        Many {
            Many {
                " "
                Int.parser()
                " "
                OneOf {
                    "red".map { Color.red }
                    "green".map { Color.green }
                    "blue".map { Color.blue }
                }
            } separator: {
                ","
            }
        } separator: {
            ";"
        }
    }

    return try? parser.parse(gameString)
}

func day02a() {
    if let contents = try? String(contentsOfFile: "input/day-02.txt") {
        let lines = contents.components(separatedBy: "\n")

        let result = lines.reduce(0) {
            if let game = parseGame(gameString: $1) {
                var redCount = 0, greenCount = 0, blueCount = 0

                for set in game.1 {
                    for cubes in set {
                        switch cubes.1 {
                        case Color.red:
                            redCount = max(cubes.0, redCount)
                        case Color.green:
                            greenCount = max(cubes.0, greenCount)
                        case Color.blue:
                            blueCount = max(cubes.0, blueCount)
                        }
                    }
                }

                return (redCount <= 12 && greenCount <= 13 && blueCount <= 14) ?
                    $0 + game.0 : $0
            } else {
                return 0
            }
        }

        print(result)
    } else {
        print("Couldn't read input file")
    }
}

func day02b() {
    if let contents = try? String(contentsOfFile: "input/day-02.txt") {
        let lines = contents.components(separatedBy: "\n")

        let result = lines.reduce(0) {
            if let game = parseGame(gameString: $1) {
                var redCount = 0, greenCount = 0, blueCount = 0

                for set in game.1 {
                    for cubes in set {
                        switch cubes.1 {
                        case Color.red:
                            redCount = max(cubes.0, redCount)
                        case Color.green:
                            greenCount = max(cubes.0, greenCount)
                        case Color.blue:
                            blueCount = max(cubes.0, blueCount)
                        }
                    }
                }

                return $0 + redCount * greenCount * blueCount
            } else {
                return 0
            }
        }

        print(result)
    } else {
        print("Couldn't read input file")
    }
}
