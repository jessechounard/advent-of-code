import Foundation
import Parsing

func parseCard(cardString: String) -> (Int, [Int], [Int])? {
    let parser = Parse {
        "Card"
        Whitespace()
        Int.parser()
        ":"
        Many {
            Whitespace()
            Int.parser()
        }
        " |"
        Many {
            Whitespace()
            Int.parser()
        }
    }

    return try? parser.parse(cardString)
}

func day04a() {
    if let contents = try? String(contentsOfFile: "input/day-04.txt") {
        let lines = contents.components(separatedBy: "\n")

        let result = lines.reduce(0) {
            if let card = parseCard(cardString: $1) {
                let winningNumbers = Set(card.1)
                return $0 + card.2.reduce(0) {
                    winningNumbers.contains($1) ? ($0 > 0 ? $0 * 2 : 1) : $0
                }
            } else {
                return 0
            }
        }
        print(result)
    }
}

func day04b() {
    if let contents = try? String(contentsOfFile: "input/day-04.txt") {
        let lines = contents.components(separatedBy: "\n")

        var scores: [Int: Int] = [:]

        for line in lines {
            if let card = parseCard(cardString: line) {
                let winningNumbers = Set(card.1)
                let wins = card.2.reduce(0) {
                    winningNumbers.contains($1) ? $0 + 1 : $0
                }
                if wins > 0 {
                    scores[card.0] = wins
                }
            }
        }

        var cards = Array(repeating: 1, count: 214)

        for id in (0..<214) {
            if let wins = scores[id] {
                for i in (1 ... wins) {
                    // ids are 1-214, indices are 0-213, account for off by 1
                    cards[id + i - 1] += cards[id - 1]
                }
            }
        }

        print(cards.reduce(0) {
            return $0 + $1
        })
    }
}
