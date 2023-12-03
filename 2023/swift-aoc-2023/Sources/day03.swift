func parseData() -> ([Int: (Int, Int)], [Int: String]) {
    if let contents = try? String(contentsOfFile: "input/day-03.txt") {
        let lines = contents.components(separatedBy: "\n")

        var inNumber = false
        var currentNumber = 0
        var numberX = 0, numberY = 0, numberLength = 0

        var numberDictionary: [Int: (Int, Int)] = [:]
        var symbolDictionary: [Int: String] = [:]

        for (mapIndex, line) in lines.enumerated() {
            for (lineIndex, character) in line.enumerated() {
                if !inNumber, character.isNumber {
                    numberX = lineIndex
                    numberY = mapIndex
                    numberLength += 1
                    inNumber = true
                    currentNumber *= 10
                    currentNumber += character.wholeNumberValue!
                } else if inNumber, character.isNumber {
                    numberLength += 1
                    currentNumber *= 10
                    currentNumber += character.wholeNumberValue!
                } else if inNumber, !character.isNumber {
                    inNumber = false
                    numberDictionary[numberX * 1000 + numberY] = (currentNumber, numberLength)
                    currentNumber = 0
                    numberLength = 0
                }

                if !character.isNumber, character != "." {
                    symbolDictionary[lineIndex * 1000 + mapIndex] = String(character)
                }
            }
        }

        return (numberDictionary, symbolDictionary)
    }

    return ([:], [:])
}

func day03a() {
    let (numberDictionary, symbolDictionary) = parseData()
    var sum = 0

    for (numberOffset, numberData) in numberDictionary {
        let numberX = numberOffset / 1000
        let numberY = numberOffset % 1000
        let partNumber = numberData.0
        let numberLength = numberData.1
        var searchSpace: [Int] = []

        for y in (numberY - 1) ... (numberY + 1) {
            for x in (numberX - 1) ... (numberX + numberLength) {
                searchSpace.append(max(0, x) * 1000 + max(0, y))
            }
        }

        for location in searchSpace {
            if symbolDictionary.keys.contains(location) {
                sum += partNumber
                break
            }
        }
    }
    print(sum)
}

func day03b() {
    let (numberDictionary, symbolDictionary) = parseData()
    var gearDictionary: [Int: [Int]] = [:]
    var sum = 0

    for (numberOffset, numberData) in numberDictionary {
        let numberX = numberOffset / 1000
        let numberY = numberOffset % 1000
        let partNumber = numberData.0
        let numberLength = numberData.1
        var searchSpace: [Int] = []

        for y in (numberY - 1) ... (numberY + 1) {
            for x in (numberX - 1) ... (numberX + numberLength) {
                searchSpace.append(max(0, x) * 1000 + max(0, y))
            }
        }

        for location in searchSpace {
            if symbolDictionary.keys.contains(location) {
                if symbolDictionary[location] == "*" {
                    var gears = gearDictionary[location] ?? []
                    gears.append(partNumber)
                    gearDictionary[location] = gears
                }
            }
        }
    }

    for gears in gearDictionary.values {
        if gears.count == 2 {
            sum += gears[0] * gears[1]
        }
    }
    print(sum)
}
