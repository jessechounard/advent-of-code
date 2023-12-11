import Foundation

func day01a() {
    if let contents = try? String(contentsOfFile: "input/day-01.txt") {
        let lines = contents.components(separatedBy: "\n")

        let result = lines.reduce(0) {
            let first = $1.first(where: { $0.isNumber })?.wholeNumberValue ?? 0
            let second = $1.last(where: { $0.isNumber })?.wholeNumberValue ?? 0
            return $0 + first * 10 + second
        }

        print(result)
    } else {
        print("Couldn't read input file")
    }
}

func day01b() {
    if let contents = try? String(contentsOfFile: "input/day-01.txt") {
        let lines = contents.components(separatedBy: "\n")

        let result = lines.reduce(0) {
            let line = $1.replacingOccurrences(of: "one", with: "o1e")
                .replacingOccurrences(of: "two", with: "t2o")
                .replacingOccurrences(of: "three", with: "t3e")
                .replacingOccurrences(of: "four", with: "f4r")
                .replacingOccurrences(of: "five", with: "f5e")
                .replacingOccurrences(of: "six", with: "s6x")
                .replacingOccurrences(of: "seven", with: "s7n")
                .replacingOccurrences(of: "eight", with: "e8t")
                .replacingOccurrences(of: "nine", with: "n9e")

            let first = line.first(where: { $0.isNumber })?
                .wholeNumberValue ?? 0
            let second = line.last(where: { $0.isNumber })?
                .wholeNumberValue ?? 0
            return $0 + first * 10 + second
        }

        print(result)
    } else {
        print("Couldn't read input file")
    }
}
