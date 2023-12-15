import Foundation

private enum Object: String {
    case Ash = "."
    case Rocks = "#"
}

private func readInput() -> [[[Object]]]? {
    if let input = try? String(contentsOfFile: "input/day-13.txt") {
        let lines = input.split(
            separator: "\n",
            maxSplits: Int.max,
            omittingEmptySubsequences: false
        )

        var list: [[[Object]]] = []
        var group: [[Object]] = []

        for line in lines {
            if line.isEmpty {
                list.append(group)
                group = []
            } else {
                group.append(line.map { $0 == "." ? Object.Ash : Object.Rocks })
            }
        }
        if !group.isEmpty {
            list.append(group)
        }

        return list
    }
    return nil
}

private func groupToRowNumbers(_ group: [[Object]]) -> [Int] {
    group.reduce(into: [Int]()) {
        $0.append($1.reduce(0) { $0 << 1 | ($1 == Object.Ash ? 1 : 0) })
    }
}

private func groupToColumnNumbers(_ group: [[Object]]) -> [Int] {
    var results = Array(repeating: 0, count: group[0].count)

    for row in group {
        for (index, object) in row.enumerated() {
            results[index] = results[index] << 1 |
                (object == Object.Ash ? 1 : 0)
        }
    }

    return results
}

private func getBitsSet(_ number: Int) -> Int {
    if number == 0 {
        return 0
    }

    var n = number & (number - 1)
    var count = 1
    while n > 0 {
        n = n & (n - 1)
        count += 1
    }

    return count
}

private func getBitsDifferent(_ lhs: Int, _ rhs: Int) -> Int {
    let and = getBitsSet(lhs & rhs)
    let or = getBitsSet(lhs | rhs)
    return abs(and - or)
}

private func isMirror(_ numberGroup: [Int], _ location: Int,
                      _ smudges: Int) -> Bool
{
    var front = location - 1, back = location
    var smudgeCount = 0

    while front >= 0, back < numberGroup.count {
        if smudgeCount == smudges {
            if numberGroup[front] != numberGroup[back] {
                return false
            }
        } else {
            let bitsDifferent = getBitsDifferent(
                numberGroup[front],
                numberGroup[back]
            )
            if bitsDifferent == 1 {
                smudgeCount += 1
            } else if bitsDifferent != 0 {
                return false
            }
        }
        front -= 1
        back += 1
    }

    if smudgeCount != smudges {
        return false
    }
    return true
}

private func getMirrorValue(_ numberGroup: [Int], _ smudges: Int) -> Int {
    for index in stride(from: numberGroup.count - 1, to: 0, by: -1) {
        if isMirror(numberGroup, index, smudges) {
            return index
        }
    }
    return 0
}

private func getMirrorValuePair(
    _ numberGroups: (rowGroup: [Int], columnGroup: [Int]),
    _ smudges: Int
) -> Int {
    let value = getMirrorValue(numberGroups.rowGroup, smudges)
    if value != 0 {
        return value * 100
    } else {
        return getMirrorValue(numberGroups.columnGroup, smudges)
    }
}

func day13a() {
    if let objects = readInput() {
        let rowGroups = objects.map { groupToRowNumbers($0) }
        let columnGroups = objects.map { groupToColumnNumbers($0) }
        print(zip(rowGroups, columnGroups).reduce(0) { $0 + getMirrorValuePair(
            $1,
            0
        ) })
    }
}

func day13b() {
    if let objects = readInput() {
        let rowGroups = objects.map { groupToRowNumbers($0) }
        let columnGroups = objects.map { groupToColumnNumbers($0) }
        print(zip(rowGroups, columnGroups).reduce(0) { $0 + getMirrorValuePair(
            $1,
            1
        ) })
    }
}
