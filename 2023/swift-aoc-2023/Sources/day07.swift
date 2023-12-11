import Foundation
import Parsing

enum CardLabel: Int, Comparable {
    case Ace = 14
    case King = 13
    case Queen = 12
    case Jack = 11
    case Ten = 10
    case Nine = 9
    case Eight = 8
    case Seven = 7
    case Six = 6
    case Five = 5
    case Four = 4
    case Three = 3
    case Two = 2
    case Joker = 1

    static func < (lhs: Self, rhs: Self) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

enum HandType: Int, Comparable {
    case FiveOfAKind = 6
    case FourOfAKind = 5
    case FullHouse = 4
    case ThreeOfAKind = 3
    case TwoPair = 2
    case OnePair = 1
    case HighCard = 0

    static func < (lhs: Self, rhs: Self) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

struct Hand {
    var cards: [CardLabel]
    var bid: Int
    var rank: HandType = .HighCard
}

func characterToCardLable(c: Character) -> CardLabel {
    switch c {
    case "A": CardLabel.Ace
    case "K": CardLabel.King
    case "Q": CardLabel.Queen
    case "J": CardLabel.Jack
    case "T": CardLabel.Ten
    case "9": CardLabel.Nine
    case "8": CardLabel.Eight
    case "7": CardLabel.Seven
    case "6": CardLabel.Six
    case "5": CardLabel.Five
    case "4": CardLabel.Four
    case "3": CardLabel.Three
    default: CardLabel.Two
    }
}

func characterToCardLableB(c: Character) -> CardLabel {
    switch c {
    case "A": CardLabel.Ace
    case "K": CardLabel.King
    case "Q": CardLabel.Queen
    case "J": CardLabel.Joker
    case "T": CardLabel.Ten
    case "9": CardLabel.Nine
    case "8": CardLabel.Eight
    case "7": CardLabel.Seven
    case "6": CardLabel.Six
    case "5": CardLabel.Five
    case "4": CardLabel.Four
    case "3": CardLabel.Three
    default: CardLabel.Two
    }
}

func rankHand(hand: Hand) -> HandType {
    var dict: [CardLabel: Int] = [:]
    for c in hand.cards {
        var count = dict[c] ?? 0
        count += 1
        dict[c] = count
    }
    var counts: [Int] = Array(repeating: 0, count: 6)
    for count in dict.values {
        counts[count] += 1
    }

    if counts[5] == 1 {
        return HandType.FiveOfAKind
    } else if counts[4] == 1 {
        return HandType.FourOfAKind
    } else if counts[3] == 1, counts[2] == 1 {
        return HandType.FullHouse
    } else if counts[3] == 1 {
        return HandType.ThreeOfAKind
    } else if counts[2] == 2 {
        return HandType.TwoPair
    } else if counts[2] == 1 {
        return HandType.OnePair
    }
    return HandType.HighCard
}

func rankHandB(hand: Hand) -> HandType {
    var dict: [CardLabel: Int] = [:]
    var jokerCount = 0
    for c in hand.cards {
        if c == CardLabel.Joker {
            jokerCount += 1
        } else {
            var count = dict[c] ?? 0
            count += 1
            dict[c] = count
        }
    }
    var counts: [Int] = Array(repeating: 0, count: 6)
    for count in dict.values {
        counts[count] += 1
    }

    if counts[5] == 1 ||
        (counts[4] == 1 && jokerCount > 0) ||
        (counts[3] == 1 && jokerCount > 1) ||
        (counts[2] > 0 && jokerCount > 2) ||
        jokerCount > 3
    {
        return HandType.FiveOfAKind
    } else if counts[4] == 1 ||
        (counts[3] == 1 && jokerCount > 0) ||
        (counts[2] > 0 && jokerCount > 1) ||
        jokerCount == 3
    {
        return HandType.FourOfAKind
    } else if (counts[3] == 1 && counts[2] == 1) ||
        (counts[2] > 1 && jokerCount > 0)
    {
        return HandType.FullHouse
    } else if counts[3] == 1 ||
        (counts[2] > 0 && jokerCount > 0) ||
        jokerCount == 2
    {
        return HandType.ThreeOfAKind
    } else if counts[2] == 2 {
        return HandType.TwoPair
    } else if counts[2] == 1 ||
        jokerCount > 0
    {
        return HandType.OnePair
    }
    return HandType.HighCard
}

func readCardInput() -> [Hand] {
    if let input = try? String(contentsOfFile: "input/day-07.txt") {
        let lines = input.split(separator: "\n")
        return lines.map {
            let splitHand = $0.split(separator: " ")
            var hand = Hand(
                cards: splitHand[0].map(characterToCardLable),
                bid: Int(splitHand[1])!
            )
            hand.rank = rankHand(hand: hand)
            return hand
        }
    }
    return []
}

func readCardInputB() -> [Hand] {
    if let input = try? String(contentsOfFile: "input/day-07.txt") {
        let lines = input.split(separator: "\n")
        return lines.map {
            let splitHand = $0.split(separator: " ")
            var hand = Hand(
                cards: splitHand[0].map(characterToCardLableB),
                bid: Int(splitHand[1])!
            )
            hand.rank = rankHandB(hand: hand)
            return hand
        }
    }
    return []
}

func day07a() {
    var hands = readCardInput()

    hands.sort {
        if $0.rank != $1.rank {
            return $0.rank < $1.rank
        }

        for i in 0 ..< 5 {
            if $0.cards[i] != $1.cards[i] {
                return $0.cards[i] < $1.cards[i]
            }
        }

        return true
    }

    var sum = 0
    for (index, hand) in hands.enumerated() {
        sum += hand.bid * (index + 1)
    }

    print(sum)
}

func day07b() {
    var hands = readCardInputB()

    hands.sort {
        if $0.rank != $1.rank {
            return $0.rank < $1.rank
        }

        for i in 0 ..< 5 {
            if $0.cards[i] != $1.cards[i] {
                return $0.cards[i] < $1.cards[i]
            }
        }

        return true
    }

    var sum = 0
    for (index, hand) in hands.enumerated() {
        sum += hand.bid * (index + 1)
    }

    print(sum)
}
