import Foundation
import Parsing

private func readInput() -> [[Int]]? {
    if let input = try? String(contentsOfFile: "input/day-09.txt") {
        let parser = Parse(input: Substring.self) {
            Many {
                Many {
                    Int.parser()
                } separator: {
                    " "
                }
            } separator: {
                "\n"
            }
        }

        return try? parser.parse(input)
    }
    return nil
}

private func solveLine(numbers: [Int]) -> (Int, Int) {
    let differences = zip(numbers.dropFirst(), numbers).map { $0 - $1 }
    if differences.allSatisfy( { $0 == 0 }) {
        return (numbers.first!, numbers.last!)
    } else {
        let next = solveLine(numbers: differences)
        return (numbers.first! - next.0, numbers.last! + next.1)
    }
}

func day09() {
    if let numbersList = readInput() {
        print(numbersList.reduce((0, 0)) { 
            let next = solveLine(numbers: $1)
            return ($0.0 + next.0, $0.1 + next.1)
        })
    }
}
