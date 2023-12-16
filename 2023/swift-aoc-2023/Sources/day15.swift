import Foundation

private struct Lens {
    var name: String
    var power: Int
}

private func readInput() -> [String] {
    if let input = try? String(contentsOfFile: "input/day-15.txt") {
        let strings = input.split(separator: ",")
        return strings.map { String($0) }
    }
    return [""]
}

private func hash(_ string: String) -> Int {
    var value = 0
    for c in string {
        value += Int(c.asciiValue!)
        value *= 17
        value %= 256
    }
    return value
}

func day15a() {
    let strings = readInput()
    print(strings.reduce(0) { $0 + hash($1) })
}

func day15b() {
    let strings = readInput()
    var boxes: [[Lens]] = Array(repeating: [], count: 256)

    for string in strings {
        if string.contains("-") {
            let s = string.split(separator: "-")
            let name = String(s[0])
            let box = hash(name)
            if let index = boxes[box].firstIndex(where: { $0.name == name }) {
                boxes[box].remove(at: index)
            }
        } else if string.contains("=") {
            let s = string.split(separator: "=")
            let name = String(s[0])
            let power = Int(s[1])!
            let box = hash(name)
            if let index = boxes[box].firstIndex(where: { $0.name == name }) {
                boxes[box][index] = Lens(name: name, power: power)
            } else {
                boxes[box].append(Lens(name: name, power: power))
            }
        }
    }

    var sum = 0
    for (boxNumber, box) in boxes.enumerated() {
        for (slot, lens) in box.enumerated() {
            sum += (boxNumber + 1) * (slot + 1) * lens.power
        }
    }

    print(sum)
}
