import Foundation
import Parsing

struct Race {
    var time: Int
    var record: Int
}

func readInputA() -> [Race]? {
    if let input = try? String(contentsOfFile: "input/day-06.txt") {
        let parser = Parse(input: Substring.self) {
            "Time:"
            Many {
                Whitespace()
                Digits()
            }
            Whitespace()
            "Distance:"
            Many {
                Whitespace()
                Digits()
            }
        }

        do {
            let data = try parser.parse(input)
            return zip(data.0, data.1).map { Race(time: $0.0, record: $0.1) }
        } catch {
            print(error)
        }
    } else {
        print("Couldn't open file")
    }

    return []
}

func readInputB() -> Race? {
    if let input = try? String(contentsOfFile: "input/day-06.txt") {
        let parser = Parse(input: Substring.self) {
            "Time:"
            Many {
                Whitespace()
                Digits()
            }
            Whitespace()
            "Distance:"
            Many {
                Whitespace()
                Digits()
            }
        }

        do {
            let data = try parser.parse(input)
            if let time = Int(data.0.reduce("") { $0 + String($1) }),
               let record = Int(data.1.reduce("") { $0 + String($1) })
            {
                return Race(time: time, record: record)
            }
        } catch {
            print(error)
        }
    } else {
        print("Couldn't open file")
    }

    return nil
}

func day06a() {
    if let races = readInputA() {
        var results: [Int] = []
        for race in races {
            var count = 0
            for x in 0 ... race.time {
                let d = (race.time - x) * x
                if d > race.record {
                    count += 1
                }
            }
            results.append(count)
        }
        print(results.reduce(1, *))
    }
}

func day06b() {
    if let race = readInputB() {
        var count = 0
        for x in 0 ... race.time {
            let d = (race.time - x) * x
            if d > race.record {
                count += 1
            }
        }
        print(count)
    }
}
